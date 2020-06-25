import * as React from 'react';
import { Menu, Header } from 'semantic-ui-react';

type NavProps = {};

export const Nav: React.FC<NavProps> = () => (
    <Menu
        secondary
        fluid
        fixed='top'
        size='massive'
        style={{ paddingTop: '0.8rem' }}
    >
        <Menu.Item header>
            fixpolicing.com
        </Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item>
                About
            </Menu.Item>
            <Menu.Item>
                Contact
            </Menu.Item>
        </Menu.Menu>
    </Menu>
);
