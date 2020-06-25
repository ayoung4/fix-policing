import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';

import * as React from 'react';
import { Container, Header, Button, Icon } from 'semantic-ui-react';

import { getLocation, Location } from '../modules/location';
import { capitalizeAll, tapLog } from '../modules/util';
import { Head } from '../components/head';

type Props = {
    success: true;
    location: Location;
} | {
    success: false;
};

const Home: NextPage<Props> = (props) => (
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
            }}>
                <div style={{
                    display: 'flex',
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Header style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
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
                        ? (<Link href={`/${props.location.state.name}/${props.location.county}`}>
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
                        ? <p>
                            <Icon name='map marker alternate' color='red' />
                                Based on your IP address, we think you're in {capitalizeAll(props.location.county)} County, {props.location.state.code.toUpperCase()}.
                            </p>
                        : <p>
                            <Icon name='close' color='red' />
                                An error occured while trying to determine your location.
                            </p>}
                </div>
            </div>
        </Container>
    </div>
);

const getProps = (ip: string) => pipe(
    getLocation(ip)(process.env.IPSTACK_API_KEY),
    TE.bimap(
        tapLog('getLocation failed'),
        tapLog('getLocation succeeded'),
    ),
    TE.fold(
        () => T.of<Props>({ success: false }),
        (location) => T.of<Props>({ success: true, location }),
    ),
    T.map((props) => ({ props })),
);

export const getServerSideProps: GetServerSideProps<Props> = ({ req }) =>
    getProps(req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        ((req.connection as any).socket
            ? (req.connection as any).socket.remoteAddress
            : null))();

export default Home;
