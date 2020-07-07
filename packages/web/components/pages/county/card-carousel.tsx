import React from 'react';
import { Button } from 'semantic-ui-react';

import { IncidentCardProps, IncidentCard } from './incident-card';

export type CardCarouselProps = {
    incidentCards: IncidentCardProps[];
};

export const CardCarousel: React.FC<CardCarouselProps> = ({ incidentCards }) => {

    const [index, setIndex] = React.useState(0);

    const onBackClick = () => setIndex(index > 0 ? index - 1 : incidentCards.length - 1);
    const onNextClick = () => setIndex(index < incidentCards.length - 1 ? index + 1 : 0);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{ width: '3rem' }}>
                <Button
                    icon='left arrow'
                    circular
                    secondary
                    onClick={onBackClick}
                    style={{ margin: 0 }}
                />
            </div>
            <IncidentCard {...incidentCards[index]} />
            <div style={{ width: '3rem' }}>
                <Button
                    icon='right arrow'
                    circular
                    secondary
                    onClick={onNextClick}
                    style={{ margin: 0 }}
                />
            </div>
        </div>
    )

}
