import { CountyData, Db, RegistrationData, StateData } from '@fix-policing/shared';

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import * as R from 'ramda';

import { readData, parseCSV, stringifyJSON, writeData, capitalizeAll } from './util';
import { sequenceT } from 'fp-ts/lib/Apply';

// states-and-counties.csv format:
// City, State abv, State, County

const readStateAndCounties = pipe(
    readData('states-and-counties.csv'),
    TE.map(parseCSV),
    TE.map(R.uniqBy((line) => line[3])),
    TE.map(R.map(([city, stateCode, state, county]) => ({
        state,
        county,
        city,
        stateCode,
    }))),
);

// registration.csv format:
// State, Deadline, Link to Register

const readRegistration = pipe(
    readData('registration.csv'),
    TE.map(parseCSV),
    TE.map(R.map(([state, deadline, link]) => ({
        state,
        deadline,
        link,
    }))),
);

const expandRace = (r: string) =>
    r === 'b'
        ? 'black'
        : r === 'w'
            ? 'white'
            : r === 'a'
                ? 'asian'
                : r === 'h'
                    ? 'hispanic'
                    : '';

const expandGender = (g: string) =>
    g === 'm'
        ? 'man'
        : g === 'f'
            ? 'woman'
            : 'person';

const santitizeName = R.pipe(
    R.replace(/"/g, ''),
    capitalizeAll,
);

// incidents.csv format:
// id, name, date, manner_of_death, armed, age, gender, race,
// city, state, signs_of_mental_illness, threat_level, flee,

// body_camera, County

const readIncidents = pipe(
    readData('incidents.csv'),
    TE.map(parseCSV),
    TE.map(R.map(([
        id,
        name,
        date,
        cause,
        armed,
        age,
        gender,
        race,
        city,
        state,
        mentalIllness,
        threat,
        fleeing,
        bodyCamera,
        county,
    ]) => ({
        id,
        name: name === 'tk tk'
            ? 'Name Not Provided'
            : santitizeName(name || ''),
        date,
        cause,
        armed,
        age: Number(age),
        gender: expandGender(gender || ''),
        race: expandRace(race || ''),
        city: capitalizeAll(city || ''),
        state: R.toUpper(state || ''),
        mentalIllness: Boolean(mentalIllness),
        threat,
        fleeing: Boolean(fleeing),
        bodyCamera: Boolean(bodyCamera),
        county: county || '',
    }))),
);

const tool = pipe(
    sequenceT(TE.taskEither)(
        readStateAndCounties,
        readRegistration,
        readIncidents,
    ),
    TE.map(([counties, registration, incidents]) =>
        R.reduce(
            (acc, { state, deadline, link }) => ({
                ...acc,
                [R.toLower(state)]: {
                    name: state,
                    registration: {
                        deadline,
                        link,
                    } as RegistrationData,
                    counties: R.reduce(
                        (acc, { county }: any) => [
                            ...acc,
                            {
                                name: R.toLower(county),
                                incidents: R.filter(
                                    (i) => i.county === county,
                                    incidents,
                                ),
                            },
                        ],
                        [] as CountyData[],
                        R.filter(
                            (c) => c.state === state,
                            counties,
                        ),
                    ),
                } as StateData,
            }),
            {} as Db,
            registration,
        )),
    TE.chain(stringifyJSON),
    TE.chain(writeData('db.json'))
);

tool().then(console.log, console.warn);
