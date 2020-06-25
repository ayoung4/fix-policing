import { Incident } from '@fix-policing/shared';

import * as React from 'react';
import * as R from 'ramda';
import * as _ from 'lodash';
import moment from 'moment';
import {
    Header,
    Card,
    Container,
} from 'semantic-ui-react';

import { Head } from '../../head';
import { IncidentCard } from './incident-card';

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
                        {props.incidents.length} fatal shooting{props.incidents.length === 1 ? '' : 's'} by
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
            </div>)}
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
                        {props.success && (
                        <a href={props.registration.link} target='_blank'>
                            Click here to register to vote in {props.state} before {props.registration.deadline}!
                        </a>
                    )}
                </Header>
            </div>
        </Container>
    </div >
);
