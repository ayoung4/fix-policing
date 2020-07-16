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
    string,
    LocationResult
>;

const checkIp = (ip: string): TE.TaskEither<string, string> =>
    ip === '::1'
        ? TE.left('localhost cant be located')
        : ipRegex({ exact: true }).test(ip)
            ? TE.right(ip)
            : TE.left('invalid ip address');

const apiEndpoint = (apiKey: string, ip: string) =>
    `http://api.ipstack.com/${ip}?access_key=${apiKey}&fields=zip,longitude,latitude,city,country_name,country_code`;

export const locateIp: LocateIp = (ip: string) =>
    (apiKey: string) => pipe(
        checkIp(ip),
        TE.map(R.tap(console.log)),
        TE.chain((verifiedIp) => pipe(
            httpGet<IpStackData>(apiEndpoint(apiKey, verifiedIp)),
            TE.mapLeft((err) => err.message),
        )),
        TE.filterOrElse(
            (res) => res.status === 200
                && !!res.data
                && !!res.data.latitude
                && !!res.data.longitude,
            () => 'location could not be determined',
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
