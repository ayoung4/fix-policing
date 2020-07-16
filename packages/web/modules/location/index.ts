import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import { getCencusArea } from './cencus-area';
import { locateIp } from './locate-ip';

export type Location = {
    country: {
        name: string;
        code: string;
    };
    state: {
        name: string;
        code: string;
    };
    county: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
};

type GetLocation = (ip: string) => RTE.ReaderTaskEither<string, string, Location>;

export const getLocation: GetLocation =
    (ip) => pipe(
        locateIp(ip),
        RTE.filterOrElse(
            (data) => data.country.code === 'us',
            () => 'location not within united states',
        ),
        RTE.chain((data) => sequenceT(RTE.readerTaskEither)(
            RTE.fromTaskEither(getCencusArea(data.lat, data.lon)),
            RTE.right(data),
        )),
        RTE.map(([area, geodata]) => ({
            ...geodata,
            county: area.county_name,
            state: {
                name: area.state_name,
                code: area.state_code,
            },
        })),
    );
