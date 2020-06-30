import * as React from 'react';
import { Grid, Header, List } from 'semantic-ui-react';
import Link from 'next/link';

export const Footer: React.FC = () => (
    <Grid divided inverted stackable>
        <Grid.Row>
            <Grid.Column width={3}>
                <Header inverted as='h5' content='fixpolicing.com' />
                <List link inverted>
                    <Link href='/'>
                        <List.Item as='a'>
                            Home
                    </List.Item>
                    </Link>
                    <Link href='/about'>
                        <List.Item as='a'>
                            About
                    </List.Item>
                    </Link>
                    <List.Item
                        as='a'
                        href='https://github.com/ayoung4/fix-policing'
                        target='_blank'
                    >
                        Github
                </List.Item>
                </List>
            </Grid.Column>
            <Grid.Column width={5}>
                <Header inverted as='h5' content='external links' />
                <List link inverted>
                    <List.Item
                        as='a'
                        href='https://policingequity.org/'
                        target='_blank'
                    >
                        Center for Policing Equity
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://www.washingtonpost.com/graphics/investigations/police-shootings-database/'
                        target='_blank'
                    >
                        Washington Post Police Shootings Investigation
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://theappeal.org/'
                        target='_blank'
                    >
                        The Appeal
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://realjusticepac.org/'
                        target='_blank'
                    >
                        Real Justice PAC
                    </List.Item>
                    <List.Item
                        as='a'
                        href='https://theyreporttoyou.org/'
                        target='_blank'
                    >
                        They Report To You
                    </List.Item>
                </List>
            </Grid.Column>
            <Grid.Column width={7}>
            </Grid.Column>
        </Grid.Row>
    </Grid>
);
