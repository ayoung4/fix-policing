import React from 'react';
import { Container, Header, List, Grid, Segment, Breadcrumb } from 'semantic-ui-react';
import Link from 'next/link';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import * as S from '../../../styles';
import { Head } from '../../head';
import { Footer } from '../../footer';

export type StateEntry = {
    name: string;
    link: string;
};

export type StateDirectoryPageProps = {
    states: StateEntry[];
};

const renderColumns = (states: StateEntry[]) =>
    pipe(
        states,
        A.chunksOf(13),
        A.mapWithIndex((i, chunk) => (
            <Grid.Column key={i}>
                <Header>{chunk[0].name[0]}-{chunk[chunk.length - 1].name[0]}</Header>
                <List size='large'>
                    {chunk.map((c, i) => (
                        <Link key={i} href={c.link}>
                            <List.Item as='a'>
                                {c.name}
                            </List.Item>
                        </Link>
                    ))}
                </List>
            </Grid.Column>
        )),
    );

export const StateDirectoryPage: React.FC<StateDirectoryPageProps> =
    ({ states }) => (
        <div>
            <Head>
                <title>Fix Policing | Directory</title>
            </Head>
            <Container style={S.concat(S.flexColumn, S.vh100)}>
                <div style={S.concat(
                    S.alignItemsEnd,
                    { display: 'flex', height: '7rem' },
                )}>
                    <div>
                        <Header>Fix Policing Directory</Header>
                        <Breadcrumb>
                            <Link href='/'>
                                <Breadcrumb.Section link>Home</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section active>Directory</Breadcrumb.Section>
                        </Breadcrumb>
                    </div>
                </div>
                <div style={S.concat(
                    S.flex3,
                    S.p4y,
                )}>
                    <Grid
                        columns={4}
                        stackable
                        style={{ width: '100%' }}
                    >
                        {renderColumns(states)}
                    </Grid>
                </div>
            </Container>
            <Segment inverted vertical style={S.p3y}>
                <Container>
                    <Footer />
                </Container>
            </Segment>
        </div>
    );
