import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as IO from 'fp-ts/lib/IO';

import * as R from 'ramda';
import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';
import jsonp from 'jsonp';

export const httpGet = <A = unknown>(url: string) =>
    TE.tryCatch<Error, AxiosResponse<A>>(
        () => axios.get(url),
        reason => new Error(String(reason))
    );

export const httpPost = <A = unknown>(url: string) =>
    TE.tryCatch<Error, AxiosResponse<A>>(
        () => axios.post(url),
        reason => new Error(String(reason))
    );

export const httpJsonpPost = (params?: object) => <E = unknown, A = unknown>(url: string): TE.TaskEither<E, A> =>
    () => new Promise((resolve, reject) => {
        console.log('call jsonp');
        jsonp(url, params, (err, data) => {
            console.log('jsonp callback', err, data);
            if (err) {
                reject(E.left(err));
            } else {
                resolve(E.right(data))
            }
        })
    });

export const capitalizeAll = R.pipe(
    R.split(' '),
    R.map(_.capitalize),
    R.join(' '),
);

export const tapLog: (s: string) => <A>(a: A) => A =
    (s) => R.tap((x) => console.log(s, x));

export const memoize: <A>(ma: IO.IO<A>) => IO.IO<A> = <A>(ma) => {
    let cache: A;
    let done = false;
    return (() => {
        if (!done) {
            cache = ma();
            done = true;
        }
        return cache;
    }) as IO.IO<A>;
};
