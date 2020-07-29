import { Incident, Election, Candidate } from '@fix-policing/shared';

import * as React from 'react';
import * as R from 'ramda';
import * as _ from 'lodash';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import moment from 'moment';
import toQueryString from 'to-querystring';
import * as Yup from 'yup';
import {
    Header,
    Card,
    Container,
    Button,
    Grid,
    Segment,
    Image,
} from 'semantic-ui-react';

import { VotingGridItem } from './voting-grid-item';
import { Head } from '../../head';
import { IncidentCard } from './incident-card';
import { ComputerSocialBar, MobileSocialBar } from './social-bar';
import { CardCarousel } from './card-carousel';
import { Footer } from '../../footer';
import * as S from '../../../styles';
import { Global } from '../../../context';
import { MailingListSignupForm } from '../../mailing-list-signup-form';
import { Formik } from 'formik';
import { httpJsonpPost } from '../../../modules/util';
import { pipe } from 'fp-ts/lib/function';

export type CountyPageProps = {
    success: true;
    county: string;
    state: string;
    stateCode: string;
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
            Since 2015, there {props.incidents.length === 1 ? 'has' : 'have'} been&nbsp;
            <span style={props.incidents.length > 0 ? { color: 'red', textDecoration: 'underline' } : {}}>{props.incidents.length} fatal encounter{props.incidents.length === 1 ? '' : 's'}</span> with
            police officers in the line of duty in { props.county}, { props.state}.
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

const makeSubscribeUrl = (params: string) =>
    `https://fixpolicing.us10.list-manage.com/subscribe/post-json?u=65b71f37cd14ab1785056d3aa&amp;id=b337ec4fa8&${params}`;

type MailchimpResponse = {
    result: 'success' | 'error';
    msg: string;
};

const submitMailingList = (data: { EMAIL: string; }) =>
    pipe(
        data,
        toQueryString,
        makeSubscribeUrl,
        (url) => httpJsonpPost({ param: 'c' })<Error, MailchimpResponse>(url),
    );

const toFilename = (s: string) => R.replace(/\s/g, '-', s);

const openGraphImageLink = (county: string, state: string) =>
    toFilename(`http://fixpolicing.com/open-graph/${state.toLowerCase()}-${county.toLowerCase()}.png`);

const secureOpenGraphImageLink = (county: string, state: string) =>
    toFilename(`https://fixpolicing.com/open-graph/${state.toLowerCase()}-${county.toLowerCase()}.png`);

export const CountyPage: React.FC<CountyPageProps> = (props) => {

    const [showIncidents, setShowIncidents] = React.useState(false);

    return (
        <div>
            <Head>
                {props.success
                    ? (<title>{`Fix Policing in ${props.county}, ${props.stateCode}`}</title>)
                    : (<title>Fix Policing</title>)}
                <meta key='description' name='description' content={props.success
                    ? `How's policing in ${props.county}, ${props.stateCode}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                <meta property='og:title' content={props.success
                    ? `Fix Policing in ${props.county}, ${props.stateCode}`
                    : 'Fix Policing'
                } />
                <meta property='og:type' content='website' />
                <meta property='og:locale' content='en_US' />
                <meta property='og:site_name' content='Fix Policing' />
                <meta property='og:description' content={props.success
                    ? `How's policing in ${props.county}, ${props.stateCode}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                {props.success && (
                    <meta property='og:image:secure_url' content={secureOpenGraphImageLink(props.county, props.state)} />
                )}
                {props.success && (
                    <meta property='og:image' content={openGraphImageLink(props.county, props.state)} />
                )}
                <meta property='og:image:type' content='image/png' />
                <meta property='og:image:width' content='1200' />
                <meta property='og:image:height' content='630' />
                {props.success && props.incidents.length > 0 && (
                    <meta property='og:image:alt' content={`Since 2015, there have been ${props.incidents.length} fatal encounters with police officers in the line of duty in ${props.county}, ${props.stateCode}.`} />
                )}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={props.success
                    ? `Fix Policing in ${props.county} county, ${props.stateCode}`
                    : 'Fix Policing'
                } />
                <meta name='twitter:description' content={props.success
                    ? `How's policing in ${props.county}, ${props.stateCode}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                <meta name='twitter:site' content='@fixpolicing' />
                <meta name='twitter:creator' content='@fixpolicing' />
                {props.success && props.incidents.length > 0 && (
                    <meta name='twitter:image' content={secureOpenGraphImageLink(props.county, props.state)} />
                )}
            </Head>
            <Container style={S.concat(S.flexColumn, S.p1y)}>
                {props.success && (<Global.Consumer>
                    {({ layout }) => layout.mobile
                        ? (<MobileSocialBar path={`${props.state.toLowerCase()}/${props.county.toLowerCase()}`} />)
                        : (<ComputerSocialBar path={`${props.state.toLowerCase()}/${props.county.toLowerCase()}`} />)}
                </Global.Consumer>)}
                <div style={S.concat(
                    sectionStyle,
                    S.vh100,
                )}>
                    <Image
                        style={S.concat(
                            S.textCenter,
                            { width: '5rem', marginTop: '2rem' },
                        )}
                        src='/icon.png'
                    />
                    {props.success && (
                        <Header size='huge' style={S.concat(S.textCenter, S.m1y)}>
                            {props.county}, {props.stateCode}
                        </Header>
                    )}
                    <Header style={S.concat(
                        S.textCenter,
                        S.m1y,
                        { maxWidth: '40rem' },
                    )}>
                        {makeHeaderText(props)}
                    </Header>
                    {props.success && props.incidents.length > 0
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
                    {props.success && props.incidents.length > 0
                        ? (
                            <div style={S.concat(
                                S.textCenter,
                                { maxWidth: '32rem' },
                            )}>
                                <p>
                                    Please click on any of the names above to view a Google search of their names and the city they were killed in. We encourage you to familiarize yourself with local coverage of each incident.
                            </p>
                                {props.incidents.length > 1 && (
                                    <Button color='blue' onClick={() => setShowIncidents(!showIncidents)}>
                                        {showIncidents
                                            ? 'Collapse Fatal Incidents'
                                            : 'Show All Fatal Incidents'}
                                    </Button>
                                )}
                            </div>
                        )
                        : (
                            <div style={S.concat(
                                S.textCenter,
                                { maxWidth: '32rem' },
                            )}>
                                <p>
                                    It may be that our dataset is incomplete. Please verify this result.
                                </p>
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
                    { minHeight: '8rem' },
                )}>
                    <Header size='large' style={S.concat(
                        S.textCenter,
                        S.m1y,
                        { maxWidth: '40rem' }
                    )}>
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
                                            {/* <Image src={c.imageLink} wrapped ui={false} /> */}
                                            <div className='image' style={{
                                                height: '300px',
                                                backgroundImage: `url(${c.imageLink}), url('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')`,
                                                backgroundOrigin: 'center',
                                                backgroundSize: 'cover',
                                            }}>
                                                {/* <object data="http://stackoverflow.com/does-not-exist.png" type="image/png">
                                                    <img
                                                        src={c.imageLink}
                                                        alt="Stack Overflow logo and icons and such" />
                                                </object> */}
                                            </div>
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
                    { minHeight: '16rem' },
                )}>
                    <p style={S.concat(
                        S.textCenter,
                        { maxWidth: '32rem' },
                    )}>
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
                    <div style={S.concat(
                        S.p4y,
                        { maxWidth: '48rem' },
                    )}>
                        <Header size='large' style={S.textCenter}>
                            If you don’t vote, nothing changes. In 2018, <span style={{ color: 'red', textDecoration: 'underline' }}>only 1 in 3 young people voted nationally.</span> Register to vote, register your neighbors, and get a mail in ballot. It’s easy as:
                        </Header>
                        <Grid columns={3} stackable style={S.concat(
                            S.p4y,
                        )}>
                            <Grid.Column textAlign='center'>
                                <VotingGridItem
                                    header={<Header style={{ fontSize: '6rem' }}>
                                        1
                                </Header>}
                                    content={<p>
                                        Register to vote.&nbsp;
                                        {props.success && (<b style={S.concat(
                                        S.textRed,
                                        { textDecoration: 'underline' },
                                    )}>
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
                </div>
                <div style={S.concat(
                    sectionStyle,
                    { minHeight: '16rem' },
                    S.p2,
                )}>
                    <div style={S.concat(
                        S.flexColumn,
                        { display: 'flex' },
                    )}>
                        <Header textAlign='center'>Join our mailing list for updates on future elections.</Header>
                        <Formik
                            initialValues={{ email: '' }}
                            onSubmit={({ email }, form) => pipe(
                                submitMailingList({ EMAIL: email }),
                                TE.filterOrElse(
                                    (res) => res.result === 'success',
                                    (res) => !!res.msg.match('is already subscribed')
                                        ? new Error(res.msg.split('<')[0])
                                        : new Error(res.msg),
                                ),
                                TE.fold(
                                    (err: Error) => T.of(err.message),
                                    (res) => T.of(res.msg),
                                ),
                                T.map(form.setStatus),
                                T.map(() => form.setSubmitting(false)),
                            )()}
                            validationSchema={Yup.object<{ email: string; }>({
                                email: Yup.string()
                                    .email('Please provide a valid email address')
                                    .required('Please provide a valid email address'),
                            })}
                        >
                            {(form) => <MailingListSignupForm {...form} />}
                        </Formik>
                    </div>
                </div>
            </Container>
            <Segment inverted vertical style={S.p3y}>
                <Container>
                    <Footer />
                </Container>
            </Segment>
        </div >
    );

};
