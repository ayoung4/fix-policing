import * as React from 'react';
import { Menu, Header } from 'semantic-ui-react';
import Link from 'next/link';

type NavProps = {
    fixed?: boolean;
};

export const Nav: React.FC<NavProps> = ({ fixed }) => (
    <Menu
        secondary
        fluid
        compact
        fixed={fixed ? 'top' : undefined}
        size='massive'
        style={{ paddingTop: '0.8rem' }}
    >
        <Menu.Item header>
            <Link href='/'>
                fixpolicing.com
            </Link>
        </Menu.Item>
        <Menu.Menu position='right'>
            <Menu.Item>
                <Link href='/about'>
                    About
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link href='/contact'>
                    Contact
                </Link>
            </Menu.Item>
        </Menu.Menu>
    </Menu>
);
