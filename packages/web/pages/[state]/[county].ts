import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Incident, Election, Candidate } from '@fix-policing/shared';
import * as R from 'ramda';
import * as _ from 'lodash';
import { GetStaticProps, GetStaticPaths } from 'next';

import { capitalizeAll } from '../../modules/util';
import { getDb } from '../../modules/db';
import { CountyPage, CountyPageProps } from '../../components/pages/county';

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

const getProps = (reqState, reqCounty) => pipe(
    getDb,
    TE.map((db) => db[reqState]),
    TE.chain((x) => !!x
        ? pipe(
            sequenceT(TE.taskEitherSeq)(
                TE.right(x),
                pipe(
                    TE.right(x),
                    TE.map((x) => R.find(
                        ({ name }) => name === reqCounty,
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
                                            : '',
                                        websiteLink: makeGoogleSearch(`${c.name} ${county.name} ${state.name}`)
                                    }),
                                    e.candidates,
                                )
                            }),
                            county.elections,
                        ),
                        registration: state.registration,
                        state: capitalizeAll(state.name),
                        stateCode: abbrState(state.name, 'abbr'),
                        county: capitalizeAll(`${county.name} ${
                            state.name === 'alaska'
                                ? 'borough'
                                : state.name === 'louisiana'
                                    ? 'parish'
                                    : 'county'
                            }`),
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

function abbrState(input, to) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (let i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (let i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}

export default CountyPage;
