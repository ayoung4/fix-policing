import * as React from 'react';
import { Card, Header } from 'semantic-ui-react';

type Props = {
    name: string;
    age: string | number;
    race: string;
    gender: string;
    cause: string;
    city: string;
    state: string;
    date: string;
};

export const IncidentCard: React.FC<Props> = ({
    name,
    age,
    race,
    gender,
    cause,
    city,
    state,
    date,
}) => (
        <Card>
            <Card.Content>
                <Header size='small' color='blue'>{name}</Header>
                <Card.Description>
                    A {age} year old {race} {gender} was {cause} on {date}, in {city}, {state}.
                </Card.Description>
            </Card.Content>
        </Card>
    );
