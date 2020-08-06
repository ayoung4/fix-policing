import { NextPage } from 'next';

import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import { Head } from '../../head';
import { Nav } from '../../nav';
import { Footer } from '../../footer';

export const AboutPage: NextPage = () => (
    <div style={{
        backgroundColor: '#EFE91F',
        position: 'relative',
    }}>
        <Head />
        <Container style={{ maxWidth: '40rem' }}>
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                paddingTop: '1rem',
                paddingBottom: '6rem',
            }}>
                <Nav />
                <Header style={{
                    textAlign: 'center',
                    fontSize: '2.8rem',
                    marginTop: '1.5rem',
                }}>
                    About this project
                </Header>
                <p>
                    Fixing policing isn’t something we’re claiming our little website can do. It’s not something that will happen in a week, a year, or possibly even a lifetime. Our goal is to help our country take steps in the right direction. Since policing is controlled by state and local politicians, we want to vote out those that don’t think there’s a problem and vote in people that will hold police to the same standards as you or me. In 2018, only 1 in 3 young people voted. We’re confident that when the other 2 in 3 young people see the number of people that police have killed in their communities since just 2015, they’ll get registered and continue to lead in holding police accountable.
                </p>
                <p>
                    This is our contribution to making young people and all Americans aware of the police violence occurring in their communities while encouraging them to register to vote and to register their neighbors. We’ll be adding details about the candidates running in sheriff, prosecutor, and judge elections in the fall. These elections and dozens of other local positions control how we hold police accountable in our communities. If we want to change it, we need to vote in people that hear us and are committed to doing the same. Learn about who’s running in your community, volunteer for them, and donate if you can.
                </p>
                <p>
                    We encourage you to run for local office if you don’t find a voice that will fight for what’s right. Local elections are easily forgotten. Many of the positions are confusing and some take place at odd times of the year. When we don’t participate in these elections, our interests aren’t represented. This is a big part of how we got here. Let’s change it.
                </p>
                <p>
                    For now, this project will focus on the upcoming November elections. But we’re hoping that it’ll evolve and continue to be a useful resource for upcoming elections - especially those that fall at odd times of the year. This is an open source project and we want to hear how you think we can make this better.
                </p>
                <p>
                    You can fork or contribute to the repo on GitHub. You can send us an e-mail to fixpolicing@gmail.com with your ideas for improvement, questions, or opportunities to work together.
                </p>
            </div>
        </Container>
        <Segment inverted vertical style={{ padding: '2em 0em' }}>
            <Container>
                <Footer />
            </Container>
        </Segment>
    </div>
);
