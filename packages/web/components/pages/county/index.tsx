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
import { ComputerSocialBar, MobileSocialBar, InlineSocialBar } from './social-bar';
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
    state: {
        name: string;
        code: string;
        incidents: Incident[];
        registration: {
            deadline: string;
            link: string;
        };
    };
    county: {
        name: string;
        incidents: Incident[];
        elections: Election[];
    };
    sharable: {
        image: string;
        secureImage: string;
        link: string;
    };
} | {
    success: false;
    reason: string;
};

const makeHeaderText = (props: CountyPageProps) =>
    props.success
        ? props.county.incidents.length > 0
            ? (<span>
                Since 2015, there {props.county.incidents.length === 1 ? 'has' : 'have'} been&nbsp;
                <span style={props.county.incidents.length > 0 ? { color: 'red', textDecoration: 'underline' } : {}}>{props.county.incidents.length} fatal encounter{props.county.incidents.length === 1 ? '' : 's'}</span> with
            police officers in the line of duty in {props.county.name}, {props.state.name}.
            </span>)
            : (<span>
                Since 2015, there {props.state.incidents.length === 1 ? 'has' : 'have'} been&nbsp;
                <span style={props.state.incidents.length > 0 ? { color: 'red', textDecoration: 'underline' } : {}}>{props.state.incidents.length} fatal encounter{props.state.incidents.length === 1 ? '' : 's'}</span> with
                police officers in the line of duty in {props.state.name}.
            </span>)
        : (<span>
            We weren't able to look up your county in our database.
            Please copy and paste this url from your browser and
            email the url to fixpolicing@gmail.com so that we can
            correct this!
        </span>);

const makeElectionsHeader = (props: CountyPageProps) =>
    props.success && props.county.elections.length > 0
        ? (
            <Header size='large' style={S.concat(
                S.textCenter,
                S.m1y,
                { maxWidth: '40rem' }
            )}>
                These are the upcoming sherriff, CA, DA and judge elections in your county:
            </Header>
        )
        : (
            <Header style={S.concat(
                S.textCenter,
                S.m1y,
                { maxWidth: '40rem' }
            )}>
                While there are no upcoming sherriff, CA, DA or judge elections in your county recorded in our database,&nbsp;
                <span style={{ color: 'red', textDecoration: 'underline' }}>
                    there are other local elections as well as state and national elections taking place on November 3rd.
                </span>&nbsp;Make your voice heard by voting and push elected officials to hold law enforcement accountable.
            </Header>
        );

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

export const CountyPage: React.FC<CountyPageProps> = (props) => {

    const [showIncidents, setShowIncidents] = React.useState(false);

    return (
        <div>
            <Head>
                {props.success
                    ? (<title>{`Fix Policing in ${props.county.name}, ${props.state.code}`}</title>)
                    : (<title>Fix Policing</title>)}
                <meta key='description' name='description' content={props.success
                    ? `How's policing in ${props.county.name}, ${props.state.code}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                <meta property='og:title' content={props.success
                    ? `Fix Policing in ${props.county.name}, ${props.state.code}`
                    : 'Fix Policing'
                } />
                <meta property='og:type' content='website' />
                <meta property='og:locale' content='en_US' />
                <meta property='og:site_name' content='Fix Policing' />
                <meta property='og:description' content={props.success
                    ? `How's policing in ${props.county.name}, ${props.state.code}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                {props.success && (
                    <meta property='og:image:secure_url' content={props.sharable.secureImage} />
                )}
                {props.success && (
                    <meta property='og:image' content={props.sharable.image} />
                )}
                <meta property='og:image:type' content='image/png' />
                <meta property='og:image:width' content='1200' />
                <meta property='og:image:height' content='630' />
                {props.success && props.county.incidents.length > 0 && (
                    <meta property='og:image:alt' content={`Since 2015, there have been ${props.county.incidents.length} fatal encounters with police officers in the line of duty in ${props.county.name}, ${props.state.code}.`} />
                )}
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={props.success
                    ? `Fix Policing in ${props.county.name}, ${props.state.code}`
                    : 'Fix Policing'
                } />
                <meta name='twitter:description' content={props.success
                    ? `How's policing in ${props.county.name}, ${props.state.code}? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                    : `How's policing in your community? Learn about about fatal encounters with police in your county and what you can do to hold local officials accountable.`
                } />
                <meta name='twitter:site' content='@fixpolicing' />
                <meta name='twitter:creator' content='@fixpolicing' />
                {props.success && props.county.incidents.length > 0 && (
                    <meta name='twitter:image' content={props.sharable.secureImage} />
                )}
            </Head>
            <Container style={S.concat(S.flexColumn, S.p1y)}>
                {props.success && (<Global.Consumer>
                    {({ layout }) => layout.mobile && (
                        <MobileSocialBar path={props.sharable.link} />
                    )}
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
                            {props.county.name}, {props.state.code}
                        </Header>
                    )}
                    <Header style={S.concat(
                        S.textCenter,
                        S.m1y,
                        { maxWidth: '40rem' },
                    )}>
                        {makeHeaderText(props)}
                    </Header>
                    {props.success && (<InlineSocialBar path={props.sharable.link} />)}
                    <p style={S.concat(
                        S.textCenter,
                        { maxWidth: '32rem' },
                    )}>
                        <b>Surprised? Share this information with your community.</b>&nbsp;We can't change these figures in the future if we don't know them today.
                    </p>
                    {props.success
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
                                                state={props.state.name}
                                                link={incident.link}
                                                date={incident.date}
                                            />
                                        ),
                                        props.county.incidents.length > 0
                                            ? props.county.incidents
                                            : props.state.incidents,
                                    )}
                                </Card.Group>
                                <br />
                            </div>)
                            : (<CardCarousel incidentCards={R.map(
                                (incident: Incident) => ({
                                    ...incident,
                                    state: props.state.name,
                                }),
                                props.county.incidents.length > 0
                                    ? props.county.incidents
                                    : props.state.incidents,
                            )} />)
                        : (<div></div>)}
                    {props.success
                        ? (
                            <div style={S.concat(
                                S.textCenter,
                                { maxWidth: '32rem' },
                            )}>
                                <p>
                                    Please click on any of the names above to view a Google search of their names and the city they were killed in. We encourage you to familiarize yourself with local coverage of each incident.
                            </p>
                                {(props.county.incidents.length > 0
                                    || props.state.incidents.length > 0)
                                    && (
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
                    {makeElectionsHeader(props)}
                </div>
                {props.success && props.county.elections.length > 0 && (
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
                                            <div className='image' style={{
                                                height: '300px',
                                                backgroundImage: `url(${c.imageLink}), url('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')`,
                                                backgroundOrigin: 'center',
                                                backgroundSize: 'cover',
                                            }} />
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
                    ), props.county.elections)
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
                                            The deadline to register to vote in {props.state.name} is {props.state.registration.deadline}!
                                        </b>)}
                                    </p>}
                                    footer={props.success && (
                                        <Button
                                            as='a'
                                            href={props.state.registration.link}
                                            target='_blank'
                                            color='blue'
                                            fluid
                                        >
                                            Register to Vote in {props.state.name}
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
                    <Footer>
                        {props.success && (<Global.Consumer>
                            {({ layout }) => !layout.mobile && (
                                <div>
                                    <p>Once you register, tell everybody you know that you won't silent on November 3rd.</p>
                                    <InlineSocialBar path={props.sharable.link} />
                                </div>
                            )}
                        </Global.Consumer>)}
                    </Footer>
                </Container>
            </Segment>
        </div >
    );

};
