import * as TE from 'fp-ts/lib/TaskEither';
import * as IO from 'fp-ts/lib/IO';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { promises as fs } from 'fs';
import * as R from 'ramda';
import * as _ from 'lodash';

export const capitalizeAll = _.memoize(R.pipe(
    R.split(' '),
    R.map(_.capitalize),
    R.join(' '),
));

export const readData = (filename: string) =>
    TE.tryCatch(
        () => fs.readFile(`${process.cwd()}/input/${filename}`, 'utf8'),
        (reason) => new Error(String(reason)),
    );

export const writeData = (filename: string) => (content: string) =>
    TE.tryCatch(
        () => fs.writeFile(`${process.cwd()}/output/${filename}`, content, 'utf8'),
        (reason) => new Error(String(reason)),
    );

export const parseJSON =
    <T>(content: string) => pipe(
        E.parseJSON(content, (reason) => new Error(String(reason))),
        TE.fromEither,
    ) as TE.TaskEither<Error, T>;

export const stringifyJSON = (obj: any) =>
    pipe(
        E.stringifyJSON(obj, (reason) => new Error(String(reason))),
        TE.fromEither,
    );

export const parseCSV = R.pipe(
    R.toLower,
    R.split('\n'),
    R.tail,
    R.map(R.split(',')),
    R.map(R.map(R.trim)),
);
