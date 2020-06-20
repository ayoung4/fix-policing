import * as TE from 'fp-ts/lib/TaskEither';
import * as IO from 'fp-ts/lib/IO';

import * as R from 'ramda';
import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

export const httpGet = <T>(url: string) =>
    TE.tryCatch<Error, AxiosResponse<T>>(
        () => axios.get(url),
        reason => new Error(String(reason))
    );

export const capitalizeAll = R.pipe(
    R.split(' '),
    R.map(_.capitalize),
    R.join(' '),
);

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
