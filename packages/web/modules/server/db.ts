import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { promises as fs } from 'fs';

import { memoize } from '../shared/util';

type RegistrationData = {
    deadline: string;
    link: string;
};

type Incident = {
    id: string;
    name: string;
    date: string;
    cause: string;
    armed: string;
    age: string;
    gender: string;
    race: string;
    mentalIllness: boolean;
    threat: string;
    fleeing: boolean;
    bodyCamera: boolean;
};

type CountyData = {
    name: string;
    incidents: Incident[];
};

type StateData = {
    name: string;
    registration: RegistrationData;
    counties: CountyData[];
};

type Db = { [state: string]: StateData };

const readData = (filename: string) =>
    TE.tryCatch(
        () => fs.readFile(`${process.cwd()}/data/${filename}`, 'utf8'),
        (reason) => new Error(String(reason)),
    );

const parseJSON: <T>(content: string) => TE.TaskEither<Error, T> =
    <T>(content) => pipe(
        E.parseJSON(content, (reason) => new Error(String(reason))),
        TE.fromEither,
    ) as TE.TaskEither<Error, T>;

export const getDb: TE.TaskEither<Error, Db> = pipe(
    readData('db.json'),
    TE.chain((contents) => parseJSON<Db>(contents)),
    memoize,
);
