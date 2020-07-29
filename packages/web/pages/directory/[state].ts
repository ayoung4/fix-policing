import { CountyData } from '@fix-policing/shared';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { ordString } from 'fp-ts/lib/Ord';
import * as A from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as R from 'ramda';
import * as _ from 'lodash';
import { GetStaticProps, GetStaticPaths } from 'next';

import { CountyDirectoryPage, CountyDirectoryPageProps } from '../../components/pages/directory/county';
import { getDb } from '../../modules/db';
import { capitalizeAll } from '../../modules/util';

type Params = {
    state: string;
};

const getProps = (state: string) => pipe(
    getDb,
    TE.chain((db) => pipe(
        db[state],
        O.fromNullable,
        TE.fromOption(() => new Error('state not found')),
    )),
    TE.map(({ counties }) => pipe(
        counties,
        A.reduce<CountyData, string[]>(
            [] as string[],
            (acc, { name }) => ([...acc, name]),
        ),
        A.sort(ordString),
        A.map((name) => ({
            name: capitalizeAll(`${name} ${
                state === 'alaska'
                    ? 'borough'
                    : state === 'louisiana'
                        ? 'parish'
                        : 'county'
                }`),
            link: `/${state}/${name}`,
        })),
    )),
    TE.map((counties) => ({
        state: capitalizeAll(state),
        counties,
    })),
    TE.fold(
        () => T.of({
            props: {
                state: '',
                counties: [],
            },
        }),
        (props) => T.of({ props }),
    ),
);

export const getStaticProps: GetStaticProps<CountyDirectoryPageProps, Params> =
    ({ params }) => getProps(params.state)();

export const getStaticPaths: GetStaticPaths<Params> = pipe(
    getDb,
    TE.map((db) => pipe(
        db,
        R.keys,
        R.map((state) => ({ params: { state } })),
    )),
    TE.fold(
        () => T.of({ paths: [], fallback: true }),
        (paths) => T.of({ paths, fallback: true }),
    ),
);

export default CountyDirectoryPage;
