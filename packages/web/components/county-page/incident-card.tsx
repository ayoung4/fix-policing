import * as React from 'react';
import { Card } from 'semantic-ui-react';

type Props = {
    key?: string | number;
    name: string;
    age: string | number;
    race: string;
    gender: string;
    cause: string;
    city: string;
    state: string;
};

export const IncidentCard: React.FC<Props> = ({
    key,
    name,
    age,
    race,
    gender,
    cause,
    city,
    state,
}) => (
    <Card key={key}>
        <Card.Content>
            <Card.Header size='small'>{name}</Card.Header>
            <Card.Description>
                A {age} year old {race} {gender} was {cause} in {city}, {state}.
            </Card.Description>
        </Card.Content>
    </Card>
);
