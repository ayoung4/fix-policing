import { Incident } from '@fix-policing/shared';

import * as React from 'react';
import * as R from 'ramda';
import * as _ from 'lodash';
import moment from 'moment';
import {
    Header,
    Card,
    Container,
    Button,
    Grid,
    Segment,
    List,
} from 'semantic-ui-react';

import { Head } from '../../head';
import { IncidentCard } from './incident-card';
import Link from 'next/link';

export type CountyPageProps = {
    success: true;
    county: string;
    state: string;
    registration: {
        deadline: string;
        link: string;
    };
    incidents: Incident[],
} | {
    success: false;
    reason: string;
};

export const CountyPage: React.FC<CountyPageProps> = (props) => (
    <div>
        {props.success
            ? (<Head
                title={`Fix Policing in ${props.county} County`}
                description=''
            />)
            : (<Head
                title={`Fix Policing in your County`}
                description=''
            />)
        }
        <Container style={{ minHeight: '100vh' }}>
            < div style={{
                display: 'flex',
                flex: 1,
                minHeight: '16rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                {props.success
                    ? (<Header
                        size='huge'
                        textAlign='center'
                        style={{ marginTop: '3rem', marginBottom: '3rem' }}

                    >
                        Since 2015, there {props.incidents.length === 1 ? 'has' : 'have'} been&nbsp;
                        <span style={{ color: props.incidents.length > 0 ? 'red' : undefined }}>{props.incidents.length} fatal shooting{props.incidents.length === 1 ? '' : 's'}</span> by
                            a police officer in the line of duty in {props.county} County, {props.state}.
                    </Header>)
                    : (<Header
                        size='huge'
                        textAlign='center'
                        style={{ marginTop: '3rem', marginBottom: '3rem' }}

                    >
                        We weren't able to look up your county in our database.
                        Please copy and paste this url from your browser and
                        email the url to fixpolicing@gmail.com so that we can
                        correct this!
                    </Header>)}
            </div>
            {props.success && (<div style={{ display: 'block' }}>
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
                                state={props.state}
                                date={moment(incident.date).calendar()}
                            />
                        ),
                        props.incidents,
                    )}
                </Card.Group>
                <p style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    paddingTop: '1rem',
                }}>
                    <a
                        href='https://github.com/washingtonpost/data-police-shootings'
                        target='_blank'
                    >
                        Above data provided by Washington Post
                    </a>
                </p>
            </div>)}
            <div style={{
                display: 'flex',
                flex: 1,
                minHeight: '24rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <p style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                }}>
                    “<b>1 in 5 Americans</b> interacts with law enforcement yearly.
                    Of those encounters, <b>1 million result in use of force</b>. And <b>if you’re Black, you are 2-4 times more likely to have force used</b> than if you are White”
                </p>
                <p style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    color: 'blue',
                }}>
                    <a href='https://policingequity.org/' target='_blank'>
                        - Center for Policing Equity
                    </a>
                </p>
            </div>
            <div style={{
                display: 'flex',
                flex: 1,
                minHeight: '16rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <Header
                    size='huge'
                    textAlign='center'
                >
                    If you don’t vote, nothing changes. In 2018, <span style={{ color: 'red' }}>only 1 in 3 young people voted nationally.</span>
                </Header>
            </div>
            <div style={{
                display: 'flex',
                flex: 1,
                minHeight: '16rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}>
                <Header
                    size='huge'
                    textAlign='center'
                    style={{
                        marginBottom: '4.5rem',
                    }}
                >
                    Register to vote, register your neighbors, and get a mail in ballot. It’s easy as:
                </Header>
                <Grid columns={3} stackable style={{ minHeight: '16rem', marginBottom: '4rem' }}>
                    <Grid.Column textAlign='center'>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <div style={{ flex: 2 }}>
                                <Header style={{ fontSize: '6rem' }}>1</Header>
                            </div>
                            <div style={{ height: '6rem' }}>
                                <p>Register to vote.&nbsp;
                                {props.success && (<b style={{ color: 'red' }}>The deadline to register to vote in {props.state} is {props.registration.deadline}!</b>)}
                                </p>
                            </div>
                            <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
                                {props.success && (
                                    <Button
                                        as='a'
                                        href={props.registration.link}
                                        target='_blank'
                                        color='blue'
                                        compact
                                        fluid
                                    >
                                        Register to Vote in {props.state}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <div style={{ flex: 2 }}>
                                <Header style={{ fontSize: '6rem' }}>2</Header>
                            </div>
                            <div style={{ height: '6rem' }}>
                                <p>Use this site to check out who isn’t registered to vote in your neighborhood and get them registered.</p>
                            </div>
                            <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
                                <Button
                                    as='a'
                                    href='https://mapthe.vote/'
                                    target='_blank'
                                    color='blue'
                                    compact
                                    fluid
                                >
                                    Visit Map the Vote
                                </Button>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <div style={{ flex: 2 }}>
                                <Header style={{ fontSize: '6rem' }}>3</Header>
                            </div>
                            <div style={{ height: '6rem' }}>
                                <p>Get your mail-in ballot. It’s easy, safe, and secure. Click below to learn how to request yours.</p>
                            </div>
                            <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
                                <Button
                                    as='a'
                                    href='https://www.vote.org/absentee-voting-rules/'
                                    target='_blank'
                                    color='blue'
                                    compact
                                    fluid
                                >
                                    Request Your Mail-in Ballot
                                </Button>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        </Container>
        <Segment inverted vertical style={{ padding: '2em 0em' }}>
            <Container>
                <Grid divided inverted stackable>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Header inverted as='h5' content='fixpolicing.com' />
                            <List link inverted>
                                <List.Item>
                                    <Link href='/about'>
                                        About
                                    </Link>
                                </List.Item>
                                <List.Item>
                                    <Link href='/contact'>
                                        Contact
                                    </Link>
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Header inverted as='h5' content='external links' />
                            <List link inverted>
                                <List.Item
                                    as='a'
                                    href='https://github.com/ayoung4/fix-policing'
                                    target='_blank'
                                >
                                    Github
                                </List.Item>
                                <List.Item
                                    as='a'
                                    href='https://realjusticepac.org/'
                                    target='_blank'
                                >
                                    Real Justice PAC
                                </List.Item>
                                <List.Item
                                    as='a'
                                    href='https://theyreporttoyou.org/'
                                    target='_blank'
                                >
                                    They Report To You
                                </List.Item>
                                <List.Item
                                    as='a'
                                    href='https://www.washingtonpost.com/graphics/investigations/police-shootings-database/'
                                    target='_blank'
                                >
                                    Washington Post Police Shootings Investigation
                                </List.Item>
                                <List.Item
                                    as='a'
                                    href='https://policingequity.org/'
                                    target='_blank'
                                >
                                    Center for Policing Equity
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={7}>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    </div >
);
