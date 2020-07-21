import * as React from 'react';
import { AppProps } from 'next/app';
import ReactGA from 'react-ga';

import { Layout } from '../components/layout';
import { Global } from '../context';

const Wrapper = ({ Component, pageProps }: AppProps) => {

    const [mobile, setMobile] = React.useState(false);
    ReactGA.initialize('UA-173066523-1');

    return (
        <Global.Provider value={{ layout: { mobile, setMobile } }}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Global.Provider>
    );

};

export default Wrapper;
