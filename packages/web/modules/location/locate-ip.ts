import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import * as R from 'ramda';
import ipRegex from 'ip-regex';

import { httpGet } from '../util';

type IpStackData = {
    country_code: string;
    country_name: string;
    city: string;
    zip: string;
    latitude: number;
    longitude: number;
};

type LocationResult = {
    lat: number;
    lon: number;
    zip: string;
    city: string;
    country: {
        code: string;
        name: string;
    };
};

type LocateIp = (ip: string) => RTE.ReaderTaskEither<
    string,
    Error,
    LocationResult
>;

export const locateIp: LocateIp = (ip: string) =>
    (apiKey: string) => pipe(
        ipRegex({ exact: true }).test(ip)
            ? httpGet<IpStackData>(`http://api.ipstack.com/${ip}?access_key=${apiKey}&fields=zip,longitude,latitude,city,country_name,country_code`)
            : TE.left(new Error('invalid ip address')),
        TE.filterOrElse(
            (res) => res.status === 200
                && !!res.data
                && !!res.data.latitude
                && !!res.data.longitude,
            () => new Error('location could not be determined'),
        ),
        TE.map(({ data }) => ({
            lat: data.latitude,
            lon: data.longitude,
            zip: data.zip,
            country: {
                code: R.toLower(data.country_code),
                name: R.toLower(data.country_name),
            },
            city: R.toLower(data.city),
        })),
    );
