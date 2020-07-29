import { CountyData, Db, RegistrationData, StateData } from '@fix-policing/shared';

import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import * as R from 'ramda';

import {
    readElections,
    readIncidents,
    readRegistration,
    readStateAndCounties,
    stringifyJSON,
    writeData,
    abbreviateState,
} from './util';

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
                                    (i) => i.county === county
                                        && i.state === abbreviateState(state).toLowerCase(),
                                    incidents,
                                ),
                                elections: R.filter(
                                    (e) => e.state === state
                                        && e.counties.includes(county),
                                    elections,
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
