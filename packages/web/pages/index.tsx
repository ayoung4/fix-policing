import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { GetServerSideProps } from 'next';
import * as R from 'ramda';

import { getLocation } from '../modules/location';
import { capitalizeAll, tapLog } from '../modules/util';
import { LandingPage, LandingPageProps } from '../components/pages/landing';

const getProps = (ip: string) => pipe(
    getLocation(ip)(process.env.IPSTACK_API_KEY),
    TE.bimap(
        tapLog('getLocation failed'),
        tapLog('getLocation succeeded'),
    ),
    TE.fold(
        () => T.of<LandingPageProps>({
            success: false,
            reason: 'There was an error'
        }),
        ({ state, county }) => T.of<LandingPageProps>({
            success: true,
            stateCode: R.toUpper(state.code),
            countyName: capitalizeAll(state.name),
            countyPageLink: `/${state.name}/${county}`,
        }),
    ),
    T.map((props) => ({ props })),
);

export const getServerSideProps: GetServerSideProps<LandingPageProps> = ({ req }) =>
    getProps(req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        ((req.connection as any).socket
            ? (req.connection as any).socket.remoteAddress
            : null))();

export default LandingPage;
