import * as React from 'react';
import { NextPage } from 'next';
import { Container, Header } from 'semantic-ui-react';

import * as S from '../../../styles';

import { Head } from '../../head';
import Link from 'next/link';

export const NotFoundPage: NextPage = () => (
    <div>
        <Head>
            <title>Fix Policing | Page Not Found</title>
            <meta key='description' name='description' content={`How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`} />
            <meta property='og:title' content='Fix Policing' key='title' />
            <meta property='og:description' content={`How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`} />
        </Head>
        <Container style={S.concat(S.flexColumn, S.p1y, S.vh100)}>
            <div style={S.concat(
                S.flex2,
                S.alignItemsCenter,
                S.justifyContentCenter,
                S.flexColumn,
            )}>
                <Header size='huge' style={S.concat(S.textCenter, S.m1y)}>
                    Page Not Found
                </Header>
                <br/>
                <p>
                    We couldn't find what you requested. If you think this 
                    is an error, please copy and paste the current url in your 
                    browser and email it to fixpolicing@gmail.com so that we can
                    correct this!
                </p>
                <Link href='/'>
                    <a>Go to homepage</a>
                </Link>
                <Link href='/directory'>
                    <a>Go to directory</a>
                </Link>
            </div>
            <div style={S.concat(
                S.flex1,
                S.alignItemsCenter,
                S.justifyContentCenter
            )}>
            </div>
        </Container>
    </div>
);