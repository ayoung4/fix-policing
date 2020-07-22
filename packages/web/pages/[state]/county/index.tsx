import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Incident, Election, Candidate } from '@fix-policing/shared';
import * as R from 'ramda';
import * as _ from 'lodash';
import { GetStaticProps, GetStaticPaths } from 'next';

import { capitalizeAll } from '../../../modules/util';
import { getDb } from '../../../modules/db';
import { CountyPage, CountyPageProps } from '../../../components/pages/county';

type Params = {
    state: string;
    county: string;
};

const makeGoogleSearch = (query: string) =>
    pipe(
        query,
        R.split(' '),
        R.join('+'),
        R.concat('https://www.google.com/search?q='),
    );

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
            TE.chain(([state, county]) =>
                !!county
                    ? TE.right({
                        ...county,
                        elections: R.map<Election, Election>(
                            (e) => ({
                                ...e,
                                type: capitalizeAll(e.type),
                                candidates: R.map<Candidate, Candidate>(
                                    (c) => ({
                                        name: capitalizeAll(c.name),
                                        imageLink: !!c.imageLink
                                            ? c.imageLink
                                            : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
                                        websiteLink: !!c.websiteLink
                                            ? c.websiteLink
                                            : makeGoogleSearch(`${c.name} ${county.name} county ${state.name}`)
                                    }),
                                    e.candidates,
                                )
                            }),
                            county.elections,
                        ),
                        registration: state.registration,
                        state: capitalizeAll(state.name),
                        county: capitalizeAll(county.name),
                        incidents: R.map<Incident, Incident>(
                            (i) => ({
                                ...i,
                                link: makeGoogleSearch(`${i.name} ${county.name}`),
                            }),
                            county.incidents,
                        ),
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
