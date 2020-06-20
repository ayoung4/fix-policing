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
            <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/semantic-ui-icon@2.3.3/icon.min.css' />
            <link rel='stylesheet' href='/semantic.min.css' />
            {children}
        </NextHead>
    );
