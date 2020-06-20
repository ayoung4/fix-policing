import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';

import Link from 'next/link';

import * as React from 'react';
import { Container, Header, Button, Icon } from 'semantic-ui-react';

import { getLocation, Location } from '../modules/client/location';
import { memoize, capitalizeAll } from '../modules/shared/util';
import { Head } from '../components/head';

const Home: React.FC = () => {

    const [location, setLocation] = React.useState<Location>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Error>(null);

    const getAndSetLocation = sequenceT(T.taskSeq)(
        T.fromIO(() => setLoading(true)),
        pipe(
            getLocation,
            memoize,
            TE.fold<Error, Location, void>(
                (err) => T.fromIO(() => setError(err)),
                (location) => T.fromIO(() => setLocation(location)),
            ),
        ),
        T.fromIO(() => setLoading(false)),
    );

    React.useEffect(() => {

        if(!loading && !location) {
            getAndSetLocation();
        }

    }, [loading, location]);

    return (
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
                        {!!location
                        ?(<Link href={`/${location.state.name}/${location.county}`}>
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
                        <br/>
                        {!loading && !!location 
                    ? (<p><Icon name='map marker alternate' color='red'/> Based on your IP address, we think you're in {capitalizeAll(location.county)} County, {location.state.code.toUpperCase()}.</p>)
                    : (<p><Icon loading name='spinner'/> Locating...</p>)}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Home;
