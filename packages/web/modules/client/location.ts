import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import * as R from 'ramda';

import { getCencusArea } from '../shared/cencus-area';
import { httpGet } from '../shared/util';

type IPLocationResult = {
    status: string;
    country: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
};

const IPLocationEndpoint = 'http://ip-api.com/json/?fields=status,message,zip,lon,lat,city,country';

const getIPLocation = pipe(
    httpGet<IPLocationResult>(IPLocationEndpoint),
    TE.filterOrElse(
        (res) => res.status === 200
            && !!res.data
            && res.data.status === 'success',
        () => new Error('location could not be determined'),
    ),
    TE.map((res) => res.data),
    TE.map(R.evolve({
        country: R.toLower,
        city: R.toLower,
    })),
    TE.filterOrElse(
        (data) => data.country === 'united states',
        () => new Error('location not within united states'),
    ),
);

export type Location = {
    county: string;
    state: {
        name: string;
        code: string;
    };
    status: string;
    country: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
};

export const getLocation = pipe(
    getIPLocation,
    TE.chain((data) => sequenceT(TE.taskEither)(
        getCencusArea(data.lat, data.lon),
        TE.right(data),
    )),
    TE.map(([area, geodata]) => ({
        ...geodata,
        county: area.county_name,
        state: {
            name: area.state_name,
            code: area.state_code,
        },
    })),
);
