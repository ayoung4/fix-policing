import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';

import * as React from 'react';
import { Container, Header, Button, Icon } from 'semantic-ui-react';

import { Head } from '../../head';

import { Nav } from './nav';

export type LandingPageProps = {
    success: true;
    stateCode: string;
    countyName: string;
    countyPageLink: string;
} | {
    success: false;
    reason: string;
};

export const LandingPage: NextPage<LandingPageProps> = (props) => (
    <div style={{
        backgroundColor: '#EFE91F',
        position: 'relative',
    }}>
        <Head
            title='Fix Policing'
            description=''
        />
        <Container style={{ maxWidth: '40rem' }}>
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                paddingTop: '1rem',
            }}>
                <Nav />
                <div style={{
                    display: 'flex',
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Header style={{
                        textAlign: 'center',
                        fontSize: '2.8rem',
                        marginTop: '0.5rem',
                    }}>
                        How’s policing in your community?
                    </Header>
                </div>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {!!props.success
                        ? (<Link href={props.countyPageLink}>
                            <Button
                                color='blue'
                                fluid
                                size='large'
                            >
                                Let's Find Out
                            </Button>
                        </Link>)
                        : (<Button
                            color='blue'
                            fluid
                            size='large'
                            disabled
                        >
                            Let's Find Out
                        </Button>)}
                    <br />
                    {props.success
                        ? <p style={{ textAlign: 'center'}}>
                            <Icon name='map marker alternate' color='red' />
                                Based on your IP address, we think you're in {props.countyName} County, {props.stateCode}.
                            </p>
                        : <p style={{ textAlign: 'center'}}>
                            <Icon name='map marker alternate' color='red' />
                                An error occured while trying to determine your location.
                            </p>}
                </div>
            </div>
        </Container>
    </div>
);
