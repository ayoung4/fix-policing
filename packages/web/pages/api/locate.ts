import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda';

import { getLocation } from '../../modules/location';
import { capitalizeAll, tapLog } from '../../modules/util';

const locate = (ip: string) => pipe(
    getLocation(ip)(process.env.IPSTACK_API_KEY),
    TE.bimap(
        tapLog('getLocation failed'),
        tapLog('getLocation succeeded'),
    ),
    TE.fold(
        (reason) => T.of<LocationResult>({
            success: false,
            stateCode: '',
            countyName: '',
            countyPageLink: '',
            reason,
        }),
        ({ state, county }) => T.of<LocationResult>({
            success: true,
            stateCode: R.toUpper(state.code),
            countyName: capitalizeAll(county),
            countyPageLink: `/${state.name}/${county}`,
            reason: '',
        }),
    ),
);

const extractIp = (req: NextApiRequest) =>
    req.headers['x-forwarded-for'] as string
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.remoteAddress;

export default (req: NextApiRequest, res: NextApiResponse) =>
    pipe(
        extractIp(req),
        locate,
        T.map((result) => res.status(200).json(result)),
    )();
