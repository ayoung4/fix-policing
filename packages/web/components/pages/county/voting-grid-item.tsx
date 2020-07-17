import * as React from 'react';

export type VotingGridItemProps = {
    header: React.ReactElement;
    content: React.ReactElement;
    footer: React.ReactElement;
};

export const VotingGridItem: React.FC<VotingGridItemProps> =
    ({ header, content, footer }) => (
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
