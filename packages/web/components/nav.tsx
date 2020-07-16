import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

import * as S from '../styles';

type NavProps = {
    fixed?: boolean;
};

export const Nav: React.FC<NavProps> = ({ fixed }) => (
    <Menu
        secondary
        fluid
        fixed={fixed ? 'top' : undefined}
        size='massive'
        style={S.p2y}
    >
        <Link href='/'>
            <Menu.Item header as='a'>
                fixpolicing.com
            </Menu.Item>
        </Link>
        <Menu.Menu position='right'>
            <Link href='/about'>
                <Menu.Item as='a'>
                    About
                </Menu.Item>
            </Link>
        </Menu.Menu>
    </Menu>
);
