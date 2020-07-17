import { Incident, Election, Candidate } from '@fix-policing/shared';

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
    Image,
    Responsive,
} from 'semantic-ui-react';

import { Head } from '../../head';
import { IncidentCard } from './incident-card';
import { ComputerSocialBar, MobileSocialBar } from './social-bar';
import { CardCarousel } from './card-carousel';
import { Footer } from '../../footer';
import * as S from '../../../styles';

export type CountyPageProps = {
    success: true;
    county: string;
    state: string;
    registration: {
        deadline: string;
        link: string;
    };
    incidents: Incident[],
    elections: Election[],
} | {
    success: false;
    reason: string;
};

const makeHeaderText = (props: CountyPageProps) =>
    props.success
        ? (<span>
            Since 2015, there { props.incidents.length === 1 ? 'has' : 'have'} been &nbsp;
            <span style={{ color: props.incidents.length > 0 ? 'red' : undefined }}>{props.incidents.length} fatal shooting{props.incidents.length === 1 ? '' : 's'}</span> by
            a police officer in the line of duty in { props.county} County, { props.state}.
        </span>)
        : (<span>
            We weren't able to look up your county in our database.
            Please copy and paste this url from your browser and
            email the url to fixpolicing@gmail.com so that we can
            correct this!
        </span>);

const makeElectionsHeader = (props: CountyPageProps) =>
    props.success && props.elections.length > 0
        ? 'These are the upcoming sherriff, CA, DA and judge elections in your county:'
        : 'There are no upcoming sherriff, CA, DA or judge elections in your county recorded in our database.';

const sectionStyle = S.concat(
    S.alignItemsCenter,
    S.justifyContentCenter,
    S.flexColumn,
);

type VotingGridItemProps = {
    header: React.ReactElement;
    content: React.ReactElement;
    footer: React.ReactElement;
};

const VotingGridItem: React.FC<VotingGridItemProps> = ({ header, content, footer }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }}>
        <div style={{ flex: 2 }}>
            {header}
        </div>
        <div style={{ height: '6rem' }}>
            {content}
        </div>
        <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
            {footer}
        </div>
    </div>
);

export const CountyPage: React.FC<CountyPageProps> = (props) => {

    const [showIncidents, setShowIncidents] = React.useState(false);

    return (
        <div>
            <Head
                title={`Fix Policing in ${props.success ? props.county : 'your'} County`}
                description=''
            />
            <Responsive {...Responsive.onlyLargeScreen}>
                <ComputerSocialBar />
            </Responsive>
            <Responsive {...Responsive.onlyWidescreen}>
                <ComputerSocialBar />
            </Responsive>
            <Responsive {...Responsive.onlyComputer}>
                <ComputerSocialBar />
            </Responsive>
            <Responsive {...Responsive.onlyTablet}>
                <MobileSocialBar />
            </Responsive>
            <Responsive {...Responsive.onlyMobile}>
                <MobileSocialBar />
            </Responsive>
            <Container style={S.concat(S.flexColumn, S.p1y)}>
                <div style={S.concat(
                    sectionStyle,
                    S.vh100,
                )}>
                    <Header size='huge' style={S.concat(S.textCenter, S.m1y)}>
                        {makeHeaderText(props)}
                    </Header>
                    {props.success && props.incidents.length > 1
                        ? showIncidents
                            ? (<div style={S.concat(
                                S.p2y,
                                { display: 'block' },
                            )}>
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
                                                link={incident.link}
                                                date={incident.date}
                                            />
                                        ),
                                        props.incidents,
                                    )}
                                </Card.Group>
                                <br />
                            </div>)
                            : (<CardCarousel incidentCards={R.map(
                                (incident: Incident) => ({
                                    ...incident,
                                    state: props.state,
                                }),
                                props.incidents,
                            )} />)
                        : (<div></div>)}
                    {props.success && props.incidents.length > 1 && (
                        <div style={S.textCenter}>
                            <p>
                                Please click on any of the names above to view a Google search of their names and the city they were killed in. We encourage you to familiarize yourself with local coverage of each incident.
                            </p>
                            <Button color='blue' onClick={() => setShowIncidents(!showIncidents)}>
                                {showIncidents
                                    ? 'Collapse Fatal Incidents'
                                    : 'Show All Fatal Incidents'}
                            </Button>
                        </div>
                    )}
                    <p style={S.concat(S.textCenter, S.m2y)}>
                        <a
                            href='https://github.com/washingtonpost/data-police-shootings'
                            target='_blank'
                        >
                            Data provided by Washington Post
                        </a>
                    </p>
                </div>
                <div style={S.concat(
                    sectionStyle,
                    { minHeight: '8rem ' },
                )}>
                    <Header size='huge' style={S.concat(S.textCenter, S.m1y)}>
                        {makeElectionsHeader(props)}
                    </Header>
                </div>
                {props.success && props.elections.length > 0 && (
                    R.addIndex(R.map)((e: Election, i) => (
                        <div
                            key={i}
                            style={S.concat(
                                sectionStyle,
                                S.p4y,
                                { minHeight: '16rem ' },
                            )}
                        >
                            <Header size='large' style={S.textCenter}>{e.type}</Header>
                            <Card.Group centered>
                                {R.addIndex(R.map)(
                                    (c: Candidate, i) => (
                                        <Card as='a' href={c.websiteLink} target='_blank' key={i}>
                                            <Image src={c.imageLink} wrapped ui={false} />
                                            <Card.Content>
                                                <Card.Header size='small' color='blue'>{c.name}</Card.Header>
                                                <Card.Description>
                                                    Click this tile to research this candidate for yourself.
                                                    </Card.Description>
                                            </Card.Content>
                                        </Card>
                                    ),
                                    e.candidates,
                                )}
                            </Card.Group>
                            <br />
                        </div>
                    ), props.elections)
                )}
                <div style={S.concat(
                    sectionStyle,
                    { minHeight: '16rem ' },
                )}>
                    <p style={S.textCenter}>
                        “<b>1 in 5 Americans</b> interacts with law enforcement yearly.
                        Of those encounters, <b>1 million result in use of force</b>. And <b>if you’re Black, you are 2-4 times more likely to have force used</b> than if you are White”
                    </p>
                    <p style={S.concat(S.textCenter, S.textBlue)}>
                        <a href='https://policingequity.org/' target='_blank'>
                            - Center for Policing Equity
                        </a>
                    </p>
                </div>
                <div style={S.concat(
                    sectionStyle,
                    { minHeight: '32rem ' },
                )}>
                    <Header size='huge' style={S.textCenter}>
                        If you don’t vote, nothing changes. In 2018, <span style={{ color: 'red' }}>only 1 in 3 young people voted nationally.</span> Register to vote, register your neighbors, and get a mail in ballot. It’s easy as:
                    </Header>
                    <Grid columns={3} stackable style={S.p4y}>
                        <Grid.Column textAlign='center'>
                            <VotingGridItem
                                header={<Header style={{ fontSize: '6rem' }}>
                                    1
                                </Header>}
                                content={<p>
                                    Register to vote.&nbsp;
                                        {props.success && (<b style={S.textRed}>
                                        The deadline to register to vote in {props.state} is {props.registration.deadline}!
                                    </b>)}
                                </p>}
                                footer={props.success && (
                                    <Button
                                        as='a'
                                        href={props.registration.link}
                                        target='_blank'
                                        color='blue'
                                        fluid
                                    >
                                        Register to Vote in {props.state}
                                    </Button>
                                )}
                            />
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <VotingGridItem
                                header={<Header style={{ fontSize: '6rem' }}>
                                    2
                                </Header>}
                                content={<p>
                                    Use this site to check out who isn’t registered to vote in your neighborhood and get them registered.
                                </p>}
                                footer={<Button
                                    as='a'
                                    href='https://mapthe.vote/'
                                    target='_blank'
                                    color='blue'
                                    fluid
                                >
                                    Visit Map the Vote
                                </Button>}
                            />
                        </Grid.Column>
                        <Grid.Column textAlign='center'>
                            <VotingGridItem
                                header={<Header style={{ fontSize: '6rem' }}>
                                    3
                                </Header>}
                                content={<p>
                                    Get your mail-in ballot. It’s easy, safe, and secure. Click below to learn how to request yours.
                                </p>}
                                footer={<Button
                                    as='a'
                                    href='https://www.vote.org/absentee-voting-rules/'
                                    target='_blank'
                                    color='blue'
                                    fluid
                                >
                                    Request Your Mail-in Ballot
                                </Button>}
                            />
                        </Grid.Column>
                    </Grid>
                </div>
            </Container>
            <Segment inverted vertical style={S.p3y}>
                <Container>
                    <Footer />
                </Container>
            </Segment>
        </div >
    );

    // return (
    //     <div>
    //         {props.success
    //             ? (<Head
    //                 title={`Fix Policing in ${props.county} County`}
    //                 description=''
    //             />)
    //             : (<Head
    //                 title={`Fix Policing in your County`}
    //                 description=''
    //             />)
    //         }
    //         <SocialBar />
    //         <Container style={{ minHeight: '100vh' }}>
    //             <div style={S.concat(
    //                 S.flex1,
    //                 S.vh100,
    //                 S.alignItemsCenter,
    //                 S.justifyContentCenter,
    //                 S.flexColumn,
    //             )}>
    //                 <div style={S.concat(S.m1y, S.textCenter)}>
    //                     {props.success
    //                         ? (<Header size='huge' textAlign='center'>
    //                             Since 2015, there {props.incidents.length === 1 ? 'has' : 'have'} been&nbsp;
    //                             <span style={{ color: props.incidents.length > 0 ? 'red' : undefined }}>{props.incidents.length} fatal shooting{props.incidents.length === 1 ? '' : 's'}</span> by
    //                             a police officer in the line of duty in {props.county} County, {props.state}.
    //                         </Header>)
    //                         : (<Header size='huge' textAlign='center'>
    //                             We weren't able to look up your county in our database.
    //                             Please copy and paste this url from your browser and
    //                             email the url to fixpolicing@gmail.com so that we can
    //                             correct this!
    //                         </Header>)}
    //                     {props.success && !showIncidents && (<CardCarousel incidentCards={R.map(
    //                         (incident: Incident) => ({
    //                             ...incident,
    //                             state: props.state,
    //                         }),
    //                         props.incidents,
    //                     )} />)}
    //                     {props.success && showIncidents && (<div style={{ display: 'block' }}>
    //                         <Card.Group stackable centered>
    //                             {R.addIndex(R.map)(
    //                                 (incident: Incident, key) => (
    //                                     <IncidentCard
    //                                         key={key}
    //                                         name={incident.name}
    //                                         age={incident.age}
    //                                         city={incident.city}
    //                                         cause={incident.cause}
    //                                         race={incident.race}
    //                                         gender={incident.gender}
    //                                         state={props.state}
    //                                         link={incident.link}
    //                                         date={(() => {
    //                                             return incident.date;
    //                                             // const m = moment(incident.date);
    //                                             // return m.isValid()
    //                                             //     ? m.calendar()
    //                                             //     : incident.date;
    //                                         })()}
    //                                     />
    //                                 ),
    //                                 props.incidents,
    //                             )}
    //                         </Card.Group>
    //                         <br />
    //                     </div>)}
    //                     <p style={S.textCenter}>
    //                         Please click on any of the names above to view a Google search of their names and the city they were killed in. We encourage you to familiarize yourself with local coverage of each incident.
    //                     </p>
    //                     {props.success && props.incidents.length > 1 && (
    //                         <Button color='blue' onClick={() => setShowIncidents(!showIncidents)}>
    //                             {showIncidents
    //                                 ? 'Collapse Fatal Incidents'
    //                                 : 'Show All Fatal Incidents'}
    //                         </Button>
    //                     )}
    //                     <p style={{
    //                         textAlign: 'center',
    //                         marginTop: '1rem',
    //                     }}>
    //                         <a
    //                             href='https://github.com/washingtonpost/data-police-shootings'
    //                             target='_blank'
    //                         >
    //                             Data provided by Washington Post
    //                         </a>
    //                     </p>
    //                 </div>
    //             </div>
    //             {props.success && (<div style={S.concat(S.flex1, S.alignItemsCenter, {
    //                 // display: 'flex',
    //                 // flex: 1,
    //                 minHeight: '16rem',
    //                 // alignItems: 'center',
    //                 // justifyContent: 'center',
    //                 // flexDirection: 'column',
    //             })}>
    //                 <Header
    //                     size='huge'
    //                     textAlign='center'
    //                 >
    //                     {props.elections.length > 0
    //                         ? 'These are the upcoming sherriff, CA, DA and judge elections in your county:'
    //                         : 'There are no upcoming sherriff, CA, DA or judge elections in your county recorded in our database.'}
    //                 </Header>
    //                 {props.elections.length > 0 && (
    //                     R.addIndex(R.map)((e: Election, i) => (
    //                         <div
    //                             key={i}
    //                             style={{
    //                                 display: 'flex',
    //                                 flex: 1,
    //                                 minHeight: '16rem',
    //                                 alignItems: 'center',
    //                                 justifyContent: 'center',
    //                                 flexDirection: 'column',
    //                             }}
    //                         >
    //                             <br />
    //                             <Header size='large' textAlign='center'>{e.type}</Header>
    //                             <br />
    //                             <Card.Group>
    //                                 {R.addIndex(R.map)(
    //                                     (c: Candidate, i) => (
    //                                         <Card as='a' href={c.websiteLink} target='_blank' key={i}>
    //                                             <Image src={c.imageLink} wrapped ui={false} />
    //                                             <Card.Content>
    //                                                 <Card.Header size='small' color='blue'>{c.name}</Card.Header>
    //                                                 <Card.Description>
    //                                                     Click this tile to research this candidate for yourself.
    //                                                 </Card.Description>
    //                                             </Card.Content>
    //                                         </Card>
    //                                     ),
    //                                     e.candidates,
    //                                 )}
    //                             </Card.Group>
    //                             <br />
    //                         </div>
    //                     ), props.elections)
    //                 )}
    //             </div>)}
    //             <div style={{
    //                 display: 'flex',
    //                 flex: 1,
    //                 minHeight: '24rem',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 flexDirection: 'column',
    //             }}>
    //                 <p style={{
    //                     textAlign: 'center',
    //                     fontSize: '1.3rem',
    //                 }}>
    //                     “<b>1 in 5 Americans</b> interacts with law enforcement yearly.
    //                 Of those encounters, <b>1 million result in use of force</b>. And <b>if you’re Black, you are 2-4 times more likely to have force used</b> than if you are White”
    //                 </p>
    //                 <p style={{
    //                     textAlign: 'center',
    //                     fontSize: '1.3rem',
    //                     color: 'blue',
    //                 }}>
    //                     <a href='https://policingequity.org/' target='_blank'>
    //                         - Center for Policing Equity
    //                 </a>
    //                 </p>
    //             </div>
    //             <div style={{
    //                 display: 'flex',
    //                 flex: 1,
    //                 minHeight: '16rem',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 flexDirection: 'column',
    //             }}>
    //                 <Header
    //                     size='huge'
    //                     textAlign='center'
    //                 >
    //                     If you don’t vote, nothing changes. In 2018, <span style={{ color: 'red' }}>only 1 in 3 young people voted nationally.</span> Register to vote, register your neighbors, and get a mail in ballot. It’s easy as:
    //                 </Header>
    //                 <Grid columns={3} stackable style={{ minHeight: '16rem', marginTop: '1rem', marginBottom: '4rem' }}>
    //                     <Grid.Column textAlign='center'>
    //                         <div style={{
    //                             display: 'flex',
    //                             flexDirection: 'column',
    //                             height: '100%'
    //                         }}>
    //                             <div style={{ flex: 2 }}>
    //                                 <Header style={{ fontSize: '6rem' }}>1</Header>
    //                             </div>
    //                             <div style={{ height: '6rem' }}>
    //                                 <p>Register to vote.&nbsp;
    //                             {props.success && (<b style={{ color: 'red' }}>The deadline to register to vote in {props.state} is {props.registration.deadline}!</b>)}
    //                                 </p>
    //                             </div>
    //                             <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
    //                                 {props.success && (
    //                                     <Button
    //                                         as='a'
    //                                         href={props.registration.link}
    //                                         target='_blank'
    //                                         color='blue'
    //                                         compact
    //                                         fluid
    //                                     >
    //                                         Register to Vote in {props.state}
    //                                     </Button>
    //                                 )}
    //                             </div>
    //                         </div>
    //                     </Grid.Column>
    //                     <Grid.Column textAlign='center'>
    //                         <div style={{
    //                             display: 'flex',
    //                             flexDirection: 'column',
    //                             height: '100%'
    //                         }}>
    //                             <div style={{ flex: 2 }}>
    //                                 <Header style={{ fontSize: '6rem' }}>2</Header>
    //                             </div>
    //                             <div style={{ height: '6rem' }}>
    //                                 <p>Use this site to check out who isn’t registered to vote in your neighborhood and get them registered.</p>
    //                             </div>
    //                             <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
    //                                 <Button
    //                                     as='a'
    //                                     href='https://mapthe.vote/'
    //                                     target='_blank'
    //                                     color='blue'
    //                                     compact
    //                                     fluid
    //                                 >
    //                                     Visit Map the Vote
    //                             </Button>
    //                             </div>
    //                         </div>
    //                     </Grid.Column>
    //                     <Grid.Column textAlign='center'>
    //                         <div style={{
    //                             display: 'flex',
    //                             flexDirection: 'column',
    //                             height: '100%'
    //                         }}>
    //                             <div style={{ flex: 2 }}>
    //                                 <Header style={{ fontSize: '6rem' }}>3</Header>
    //                             </div>
    //                             <div style={{ height: '6rem' }}>
    //                                 <p>Get your mail-in ballot. It’s easy, safe, and secure. Click below to learn how to request yours.</p>
    //                             </div>
    //                             <div style={{ flex: 1, width: '100%', paddingTop: '1rem' }}>
    //                                 <Button
    //                                     as='a'
    //                                     href='https://www.vote.org/absentee-voting-rules/'
    //                                     target='_blank'
    //                                     color='blue'
    //                                     compact
    //                                     fluid
    //                                 >
    //                                     Request Your Mail-in Ballot
    //                             </Button>
    //                             </div>
    //                         </div>
    //                     </Grid.Column>
    //                 </Grid>
    //             </div>
    //             <br />
    //             <br />
    //         </Container>
    //         <Segment inverted vertical style={{ padding: '2em 0em' }}>
    //             <Container>
    //                 <Footer />
    //             </Container>
    //         </Segment>
    //     </div >
    // );
};
