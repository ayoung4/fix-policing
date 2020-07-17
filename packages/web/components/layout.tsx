import * as React from 'react';
import { Responsive } from 'semantic-ui-react';

import { Global } from '../context';

const getWidth = () => {
    const isSSR = typeof window === 'undefined'
    const width = isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
    return Number(width);
};

export const Layout: React.FC =
    ({ children }) => (
        <Global.Consumer>
            {({ layout }) => (
                <Responsive
                    getWidth={getWidth}
                    onUpdate={(e, data) => {
                        layout.setMobile(data.width.valueOf() <= Responsive.onlyMobile.maxWidth);
                    }}
                    fireOnMount={true}
                >
                    {children}
                </Responsive>)}
        </Global.Consumer>
    );