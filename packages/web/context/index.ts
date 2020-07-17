import * as React from 'react';
import { NextPage } from 'next';
import { constUndefined } from 'fp-ts/lib/function';

export type Env = {
    layout: {
        mobile: boolean;
        setMobile: (isMobile: boolean) => any;
    };
};

export type Page<P = {}, IP = P> = NextPage<{ env: Env } & P, IP>;

export const Global =
    React.createContext<Env>({
        layout: {
            mobile: false,
            setMobile: constUndefined,
        },
    });
