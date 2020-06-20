import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import * as R from 'ramda';

import { httpGet } from './util';

export type CencusArea = {
    county_fips: string;
    county_name: string;
    state_fips: string;
    state_code: string;
    state_name: string;
};

export type CencusAreaResult = {
    results: CencusArea[];
};

export const getCencusArea = (lat: number, lon: number) => pipe(
    httpGet<CencusAreaResult>(`https://geo.fcc.gov/api/census/area?lat=${lat}&lon=${lon}`),
    TE.filterOrElse(
        (res) => res.status === 200
            && !!res.data
            && res.data.results.length > 0,
        () => new Error('county could not be determined'),
    ),
    TE.map((res) => res.data.results),
    TE.map((results) => results[0]),
    TE.map(R.evolve({
        county_name: R.toLower,
        state_code: R.toLower,
        state_name: R.toLower,
    })),
);
