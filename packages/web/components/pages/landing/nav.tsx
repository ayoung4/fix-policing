import * as React from 'react';
import { Icon } from 'semantic-ui-react';

type NavProps = {};

export const Nav: React.FC<NavProps> = () => (
    <p><Icon name='close' size='huge' />Nav!</p>
);
