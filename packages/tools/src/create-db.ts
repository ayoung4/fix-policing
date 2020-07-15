import { CountyData, Db, RegistrationData, StateData } from '@fix-policing/shared';

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import * as R from 'ramda';

import {
    readData,
    parseCSV,
    parseTSV,
    stringifyJSON,
    writeData,
    capitalizeAll,
} from './util';

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

// elections.tsv format:
// State, Countys, Upcoming elections, Recommended Candidate, 
// Candidate (I), Candidate (I): Image link, Candidate (I): Website, 
// Candidate (C), Candidate (C): Image link, Candidate (C): Website,	
// Candidate (C2), Candidate (C2): Image link, Candidate (C2): Website,	
// Candidate (C3), Candidate (C3): Image link, Candidate (C3): Website,	
// Candidate (C4), Candidate (C4): Image link, Candidate (C4): Website,	
// Candidate (C5), Candidate (C5): Image link, Candidate (C5): Website,	
// Candidate (C6), Candidate (C6): Image link, Candidate (C6): Website,	
// Candidate (C7), Candidate (C7): Image link, Candidate (C7): Website,	
// Candidate (C8), Candidate (C8): Image link, Candidate (C8): Website,	
// Candidate (C9), Candidate (C9): Image link, Candidate (C9): Website,	
// Candidate (C10),	Candidate (C10): Image link, Candidate (C10): Website

const readElections = pipe(
    readData('elections.tsv'),
    TE.map(parseTSV),
    TE.map(R.map(([
        state, counties, type, recommendedCandidate,
        i, iImage, iWebsite,
        c1, c1Image, c1Website,
        c2, c2Image, c2Website,
        c3, c3Image, c3Website,
        c4, c4Image, c4Website,
        c5, c5Image, c5Website,
        c6, c6Image, c6Website,
        c7, c7Image, c7Website,
        c8, c8Image, c8Website,
        c9, c9Image, c9Website,
        c10, c10Image, c10Website,
    ]) => ({
        state,
        counties: pipe(
            R.split(',', counties),
            R.map(R.trim),
        ),
        type,
        recommendedCandidate,
        candidates: pipe(
            R.filter(
                ([name]) => !!name,
                [
                    [i, iImage, iWebsite],
                    [c1, c1Image, c1Website],
                    [c2, c2Image, c2Website],
                    [c3, c3Image, c3Website],
                    [c4, c4Image, c4Website],
                    [c5, c5Image, c5Website],
                    [c6, c6Image, c6Website],
                    [c7, c7Image, c7Website],
                    [c8, c8Image, c8Website],
                    [c9, c9Image, c9Website],
                    [c10, c10Image, c10Website],
                ] as [string, string, string][],
            ),
            R.map(([name, imageLink, websiteLink]) => ({
                name: santitizeName(name),
                imageLink,
                websiteLink,
            })),
        ),
    }))),
);

const tool = pipe(
    sequenceT(TE.taskEither)(
        readStateAndCounties,
        readRegistration,
        readIncidents,
        readElections,
    ),
    TE.map(([counties, registration, incidents, elections]) =>
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
                                elections: R.filter(
                                    (e) => e.counties.includes(county),
                                    elections,
                                )
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
