import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import * as RD from '@devexperts/remote-data-ts';
import { Container, Header, Button, Icon } from 'semantic-ui-react';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import { Head } from '../../head';
import { Nav } from '../../nav';
import { httpGet } from '../../../modules/util';

type Location = {
    stateCode: string;
    countyName: string;
    countyPageLink: string;
};

type State = RD.RemoteData<string, Location>;

const renderButton = RD.fold<string, Location, React.ReactElement>(
    () => (
        <div></div>
    ),
    () => (
        <div>
            <Button
                color='blue'
                fluid
                size='large'
                disabled
            >
                Let's Find Out
            </Button>
            <p style={{ textAlign: 'center' }}>
                <Icon name='spinner' loading />
                We're determining your county...
            </p>
        </div>
    ),
    (err) => (
        <div>
            <Button
                color='blue'
                fluid
                size='large'
                disabled
            >
                Let's Find Out
            </Button>
            <p style={{ textAlign: 'center' }}>
                <Icon name='map marker alternate' color='red' />
                An error occured while trying to determine your location: {err}
            </p>
        </div>
    ),
    ({ countyPageLink, countyName, stateCode }) => (
        <div>
            <Link href={countyPageLink}>
                <Button
                    color='blue'
                    fluid
                    size='large'
                >
                    Let's Find Out
                </Button>
            </Link>
            <p style={{ textAlign: 'center' }}>
                <Icon name='map marker alternate' color='red' />
                Based on your IP address, we think you're in {countyName} County, {stateCode}.
            </p>
        </div>
    ),
);

export const LandingPage: NextPage = () => {

    const [state, setState] = React.useState<State>(RD.initial);

    const onRender = pipe(
        httpGet<LocationResult>('/api/locate'),
        TE.bimap(
            (err) => err.message,
            identity,
        ),
        TE.filterOrElse(
            (res) => res.status === 200 && !!res.data,
            (res) => res.statusText,
        ),
        TE.map((res) => res.data),
        TE.fold(
            (message): T.Task<State> => T.of(RD.failure<string>(message)),
            (result): T.Task<State> => result.success
                ? T.of(RD.success(({
                    countyName: result.countyName,
                    countyPageLink: result.countyPageLink,
                    stateCode: result.stateCode,
                })))
                : T.of(RD.failure(result.reason)),
        ),
        T.map(setState),
    );

    React.useEffect(() => { onRender() }, []);

    return (
        <div style={{
            backgroundColor: '#EFE91F',
            position: 'relative',
        }}>
            <Head
                title='Fix Policing'
                description={`How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`}
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
                        {renderButton(state)}
                    </div>
                </div>
            </Container>
        </div>
    );
};