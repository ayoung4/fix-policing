import * as React from 'react';
import { Icon } from 'semantic-ui-react';

export const SocialBar: React.FC = () => (
    <div style={{
        position: 'fixed',
        left: 0,
        width: '3rem',
        height: '100vh',
        zIndex: 999,
    }}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '16rem',
                width: '100%',
                backgroundColor: '#EFE91F',
            }}>
                <Icon name='facebook' size='large' />
                <br/>
                <Icon name='twitter' size='large' />
                <br/>
                <Icon name='instagram' size='large' />
            </div>
        </div>
    </div>
);
