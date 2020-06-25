import { Incident } from '@fix-policing/shared';

import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import * as React from 'react';
import * as R from 'ramda';
import * as _ from 'lodash';
import moment from 'moment';
import {
    Header,
    Card,
    Container,
} from 'semantic-ui-react';
import {
    NextPage,
    GetStaticProps,
    GetStaticPaths,
    InferGetStaticPropsType,
} from 'next';

import { capitalizeAll } from '../../modules/util';
import { getDb } from '../../modules/db';
import { Head } from '../../components/head';
import { Headline } from '../../components/county-page/headline';
import { IncidentCard } from '../../components/county-page/incident-card';

type Props = {
    success: true;
    data: {
        county: string;
        state: string;
        registration: {
            deadline: string;
            link: string;
        };
        incidents: Incident[],
    };
} | {
    success: false;
    reason: string;
};

type Params = {
    state: string;
    county: string;
};

const getProps = (state, county) => pipe(
    getDb,
    TE.map((db) => db[state]),
    TE.map(({ counties, registration }) => ({
        state: capitalizeAll(state),
        county: capitalizeAll(county),
        registration,
        incidents: R.find(
            ({ name }) => name === county,
            counties,
        ).incidents,
    })),
    TE.fold(
        (e) => T.of<Props>({
            success: false,
            reason: e.message,
        }),
        (data) => T.of<Props>({
            success: true,
            data,
        }),
    ),
    T.map((props) => ({ props }))
);

export const getStaticProps: GetStaticProps<Props, Params> = (context) =>
    getProps(context.params.state, context.params.county)();

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

type CountyPage = NextPage<InferGetStaticPropsType<typeof getStaticProps>>;

const County: CountyPage = (props) => (
    !props.success
        ? <div>Error!</div>
        : <div>
            <Head
                title={`Fix Policing in ${props.data.county} County`}
                description=''
            />
            <Container style={{ minHeight: '100vh' }}>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    minHeight: '16rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <Headline
                        numIncidents={props.data.incidents.length}
                        county={props.data.county}
                        state={props.data.state}
                    />
                </div>
                <div style={{ display: 'block' }}>
                    <Card.Group stackable centered>
                        {R.addIndex(R.map)(
                            (incident: Incident, key) => (
                                <IncidentCard
                                    key={key}
                                    name={incident.name}
                                    age={incident.age}
                                    city={incident.city}
                                    cause={incident.cause}
                                    race={incident.race}
                                    gender={incident.gender}
                                    state={props.data.state}
                                    date={moment(incident.date).format('MMMM Do YYYY')}
                                />
                            ),
                            props.data.incidents,
                        )}
                    </Card.Group>
                </div>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    minHeight: '24rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <Header
                        size='huge'
                        textAlign='center'
                        style={{ marginTop: '3rem' }}
                    >
                        “1 in 5 Americans interacts with law enforcement yearly. Of those encounters, 1 million result in use of force. And if you’re Black, you are 2-4 times more likely to have force used than if you are White”
                    </Header>
                    <Header
                        textAlign='center'
                    > - center for policing equity
                    </Header>
                </div>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    minHeight: '24rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}>
                    <Header
                        size='huge'
                        textAlign='center'
                    >
                        If you don’t vote, nothing changes. In 2018, only 1 in 3 young people voted nationally.&nbsp;
                        <a href={props.data.registration.link} target='_blank'>
                            Click here to register to vote in {props.data.state} before {props.data.registration.deadline}!
                        </a>
                    </Header>
                </div>
            </Container>
        </div>
);

export default County;
