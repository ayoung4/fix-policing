import * as React from 'react';
import { Card, Header } from 'semantic-ui-react';

export type IncidentCardProps = {
    name: string;
    age: string | number;
    race: string;
    gender: string;
    cause: string;
    city: string;
    state: string;
    date: string;
    link?: string;
};

export const IncidentCard: React.FC<IncidentCardProps> = ({
    name,
    age,
    race,
    gender,
    cause,
    city,
    state,
    date,
    link,
}) => !!link
        ? (
            <Card as={'a'} href={link} target='_blank'>
                <Card.Content>
                    <Header size='small' color='blue'>{name}</Header>
                    <Card.Description>
                        A {age} year old {race} {gender} was {cause} on {date}, in {city}, {state}.
                </Card.Description>
                </Card.Content>
            </Card>
        )
        : (
            <Card>
                <Card.Content>
                    <Header size='small' color='blue'>{name}</Header>
                    <Card.Description>
                        A {age} year old {race} {gender} was {cause} on {date}, in {city}, {state}.
                </Card.Description>
                </Card.Content>
            </Card>
        );
