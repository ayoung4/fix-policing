import * as React from 'react';
import { Card } from 'semantic-ui-react';

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
                <Card.Header size='small'>{name}</Card.Header>
                <Card.Description>
                    A {age} year old {race} {gender} was {cause} on {date}, in {city}, {state}.
                </Card.Description>
            </Card.Content>
        </Card>
    );
