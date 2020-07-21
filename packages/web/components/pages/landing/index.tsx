import * as React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import * as RD from '@devexperts/remote-data-ts';
import { Container, Header, Button, Icon } from 'semantic-ui-react';
import { pipe, flow, identity } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import * as S from '../../../styles';

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
        <div>
            <Button
                color='blue'
                fluid
                size='large'
                disabled
            >
                Let's Find Out
            </Button>
        </div>
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
            <p style={S.concat(S.textCenter, S.m1y)}>
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
            <p style={S.concat(S.textCenter, S.m1y)}>
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
            <p style={S.concat(S.textCenter, S.m1y)}>
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
        <div style={S.bkYellow}>
            <Head
                title='Fix Policing'
                description={`How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`}
            />
            <Container style={S.concat(S.flexColumn, S.p1y, S.vh100)}>
                <Nav />
                <div style={S.concat(
                    S.flex2,
                    S.alignItemsCenter,
                    S.justifyContentCenter
                )}>
                    <Header size='huge' style={S.concat(S.textCenter, S.m1y)}>
                        How’s policing in your community?
                    </Header>
                </div>
                <div style={S.concat(
                    S.flex1,
                    S.alignItemsCenter,
                    S.justifyContentCenter
                )}>
                    {renderButton(state)}
                </div>
            </Container>
        </div>
    );
};