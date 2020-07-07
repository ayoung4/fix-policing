import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import * as R from 'ramda';
import * as _ from 'lodash';
import { GetStaticProps, GetStaticPaths } from 'next';

import { capitalizeAll } from '../../modules/util';
import { getDb } from '../../modules/db';
import { CountyPage, CountyPageProps } from '../../components/pages/county';
import { Incident } from '@fix-policing/shared';

type Params = {
    state: string;
    county: string;
};

const getProps = (state, county) => pipe(
    getDb,
    TE.map((db) => db[state]),
    TE.chain((x) => !!x
        ? pipe(
            sequenceT(TE.taskEitherSeq)(
                TE.right(x),
                pipe(
                    TE.right(x),
                    TE.map((x) => R.find(
                        ({ name }) => name === county,
                        x.counties,
                    )),
                ),
            ),
            TE.chain(([{ registration }, county]) =>
                !!county
                    ? TE.right({
                        state: capitalizeAll(state),
                        county: capitalizeAll(county.name),
                        registration,
                        incidents: R.map<Incident, Incident>(
                            (i) => ({
                                ...i,
                                link: `https://www.google.com/search?q=${R.join('+', [...R.split(' ', i.name), county.name])}`
                            }),
                            county.incidents,
                        )
                    })
                    : TE.left(new Error('the county is either missing from the database or misspelled')),
            ),
        )
        : TE.left(new Error('the state is either missing from the database or misspelled'))),
    TE.fold(
        (e) => T.of<CountyPageProps>({
            success: false,
            reason: e.message,
        }),
        (res) => T.of<CountyPageProps>({
            success: true,
            ...res,
        }),
    ),
    T.map((props) => ({ props }))
);

export const getStaticProps: GetStaticProps<CountyPageProps, Params> =
    ({ params }) => getProps(params.state, params.county)();

export const getStaticPaths: GetStaticPaths<Params> = pipe(
    getDb,
    TE.map((db) => R.reduce(
        (acc, [state, data]) => [
            ...acc,
            ...R.reduce(
                (acc, { name }) => [...acc, {
                    params: {
                        state,
                        county: name,
                    }
                }],
                [],
                data.counties,
            ),
        ],
        [],
        R.toPairs(db),
    )),
    TE.fold(
        () => T.of({ paths: [], fallback: true }),
        (paths) => T.of({ paths, fallback: true }),
    ),
);

export default CountyPage;
