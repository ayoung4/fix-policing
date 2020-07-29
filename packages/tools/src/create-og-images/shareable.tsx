import React from 'react';
import { Header, Image } from 'semantic-ui-react';
import * as _ from 'lodash';
import { readFileSync } from 'fs';

export type ShareableProps = {
    state: string;
    stateCode: string;
    county: string;
    hasElections: boolean;
    numIncidents: {
        county: number;
        state: number;
    };
};

const loadIconSrc = _.memoize(
    () => `data:image/jpeg;base64,${readFileSync(`${process.cwd()}/output/icon.png`)
        .toString('base64')}`);

export const Shareable: React.FC<ShareableProps> =
    ({ state, stateCode, county, numIncidents, hasElections }) => (
        <div style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1591281673388-2f9544c36639?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            paddingLeft: '2rem',
            paddingRight: '2rem',
        }}>
            <div style={{
                display: 'flex',
                textAlign: 'center',
                flex: 3,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Image size='small' src={loadIconSrc()} />
                <Header
                    inverted
                    textAlign='center'
                    style={{ fontSize: '62px' }}
                >
                    {county}, {stateCode}
                </Header>
            </div>
            <div style={{
                display: 'flex',
                textAlign: 'center',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {numIncidents.county === 0
                    ? (<Header
                        inverted
                        style={{ fontSize: '35px', fontWeight: 400 }}
                        textAlign='center'
                        size='large'
                    >
                        Since 2015, there {numIncidents.state === 1 ? 'has' : 'have'} been&nbsp;
                        <b style={numIncidents.state > 0
                            ? { color: 'red', textDecoration: 'underline' } : {}
                        }>{numIncidents.state} fatal encounter{numIncidents.state === 1 ? '' : 's'}</b> with
                        police officers in the line of duty in the state of {state}.
                    </Header>)
                    : (<Header
                        inverted
                        style={{ fontSize: '35px', fontWeight: 400 }}
                        textAlign='center'
                        size='large'
                    >
                        Since 2015, there {numIncidents.county === 1 ? 'has' : 'have'} been&nbsp;
                        <b style={numIncidents.county > 0
                            ? { color: 'red', textDecoration: 'underline' } : {}
                        }>{numIncidents.county} fatal encounter{numIncidents.county === 1 ? '' : 's'}</b> with
                        police officers in the line of duty in {county}, {stateCode}.
                    </Header>)}
            </div>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {hasElections
                    ? (<Header
                        inverted
                        textAlign='center'
                        size='large'
                        style={{ fontSize: '35px', fontWeight: 400 }}
                    >
                        {county} has upcoming sherriff, DA and/or judge elections. Do you know who you're voting for?
                    </Header>)
                    : (<Header
                        inverted
                        textAlign='center'
                        size='large'
                        style={{ fontSize: '35px', fontWeight: 400 }}
                    >
                        Learn more about the role of sherriff, DA and judge and how to vote in {state}.
                    </Header>)}
            </div>
            <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <Header
                    inverted
                    textAlign='center'
                    size='huge'
                    style={{ fontSize: '45px' }}
                >
                    www.fixpolicing.com
            </Header>
            </div>
        </div>
    );
