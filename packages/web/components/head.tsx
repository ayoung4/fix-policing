import * as React from 'react';
import NextHead from 'next/head';

type Props = {
    title: string;
    description: string;
};

export const Head: React.FC<Props> =
    ({ title, description, children }) => (
        <NextHead>
            <title>{title}</title>
            <meta property='og:title' content={title} key='title' />
            <meta key='description' name='description' content={description} />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <link rel='icon' href='/favicon.ico' />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
            <link rel='stylesheet' href='/semantic.min.css' />
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-173066523-1"></script>
            <script src='/ga.js'></script>
            {children}
        </NextHead>
    );
