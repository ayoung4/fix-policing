import * as React from 'react';
import NextHead from 'next/head';

export const Head: React.FC =
    ({ children }) => (
        <NextHead>
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <link rel='icon' href='/favicon.ico' />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
            <link rel='stylesheet' href='/semantic.min.css' />
            {children}
        </NextHead>
    );
