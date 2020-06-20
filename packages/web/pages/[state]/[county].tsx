import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';

import * as React from 'react';
import * as R from 'ramda';
import * as _ from 'lodash';
import { Header, Card, Container } from 'semantic-ui-react';

import { NextPage, GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';

import { capitalizeAll } from '../../modules/shared/util';
import { getDb } from '../../modules/server/db';

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
        incidents: any[],
    };
} | {
    success: false;
    reason: string;
};

const foldProps = TE.fold<Error, any, { props: Props }>(
    (e) => T.of({
        props: {
            success: false,
            reason: e.message,
        },
    }),
    (data) => T.of({
        props: {
            success: true,
            data,
        },
    }),
);

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
    foldProps,
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

{/* <div>
    <Head
        title={`Fix Policing in ${props.data.county} County`}
        description=''
    />
    <div style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        flexDirection: 'column',
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }}>
            <Header size='huge' textAlign='center'>
                Since 2015, there {props.data.incidents.length === 1 ? 'has' : 'have'} been {props.data.incidents.length} fatal shooting{props.data.incidents.length === 1 ? '' : 's'} by a police officer in the line of duty in {props.data.county} County, {props.data.state}.
                    </Header>
            <div style={{ display: 'block' }}>
                <Card.Group stackable centered >
                    {R.addIndex(R.map)(
                        ({ name, age, race, gender, cause, city }, key) => (
                            <Card key={key}>
                                <Card.Content>
                                    {name !== 'tk tk'
                                        ? <Card.Header size='small'>{capitalizeAll(name)}</Card.Header>
                                        : <Card.Header size='small'>Name Unreleased</Card.Header>
                                    }
                                    <Card.Description>
                                        A {age} year old {race === 'w' ? 'white ' : race === 'b' ? 'black ' : ''}{gender === 'm' ? 'man' : 'woman'} was {cause} in {_.capitalize(city)}, {_.capitalize(props.data.state)}.
                                            </Card.Description>
                                </Card.Content>
                            </Card>
                        ),
                        props.data.incidents,
                    )}
                </Card.Group>
            </div>
            <br />
            <p>All of the data above is from The Washington Post’s Fatal Force Project. Learn more by clicking here.</p>
            <br />
            <Header>
                “1 in 5 Americans interacts with law enforcement yearly. Of those encounters, 1 million result in use of force. And if you’re Black, you are 2-4 times more likely to have force used than if you are White” - center for policing equity
                        </Header>
            <br />
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '6rem',
            flexDirection: 'column',
        }}>
            <Header>If you don’t vote, nothing changes. In 2018, only 1 in 3 young people voted nationally.</Header>
            <p>{props.data.registration.deadline}</p>
            <p>{props.data.registration.link}</p>
        </div>
    </div>
</div> */}

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
                            (incident, key) => (
                                <IncidentCard
                                    key={incident.id}
                                />
                                <Card key={key}>
                                    <Card.Content>
                                        {name !== 'tk tk'
                                            ? <Card.Header size='small'>{capitalizeAll(name)}</Card.Header>
                                            : <Card.Header size='small'>Name Unreleased</Card.Header>
                                        }
                                        <Card.Description>
                                            A {age} year old {race === 'w' ? 'white ' : race === 'b' ? 'black ' : ''}{gender === 'm' ? 'man' : 'woman'} was {cause} in {_.capitalize(city)}, {_.capitalize(props.data.state)}.
                                            </Card.Description>
                                    </Card.Content>
                                </Card>
                                ),
                            props.data.incidents,
                        )}
                    </Card.Group>
                </div>
            </Container>
        </div>
);

export default County;
