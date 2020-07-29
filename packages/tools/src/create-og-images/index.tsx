import { Incident, Election } from '@fix-policing/shared';

import * as TE from 'fp-ts/lib/TaskEither';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import { batchTraverse } from 'fp-ts-contrib/lib/batchTraverse';

import { Cluster } from 'puppeteer-cluster';
import * as R from 'ramda';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { promises as fs } from 'fs';

import {
    readIncidents,
    readElections,
    readStateAndCounties,
    writeData,
    capitalizeAll,
} from '../util';
import {
    Shareable,
    ShareableProps,
} from './shareable';

const toFilename = (s: string) => R.replace(/\s/g, '-', s);

const inHtml = (contents: string) => `
    <html>
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        </head>
        <body style="margin: 0; zoom: 100%">
            ${contents}
        </body>
    </html>
    `;

type RenderHtmlP = (fs: string[]) => TE.TaskEither<Error, void>;

const renderHtmlP: RenderHtmlP = (filenames) => async () => {

    try {

        const cluster: Cluster<string, void> =
            await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_CONTEXT,
                maxConcurrency: 10,
                monitor: true,
            });

        await cluster.task(async ({ page, data: filename }) => {
            const html2To1 = await fs.readFile(`${process.cwd()}/output/html/${filename}.html`, 'utf8');
            await page.setContent(html2To1);
            await page.setViewport({
                width: 1200,
                height: 630,
            });
            await page.waitFor(400);
            await page.screenshot({
                path: `${process.cwd()}/output/images/${filename}.png`,
                type: 'png',
            });
        });

        filenames.forEach((filename) => cluster.queue(filename));

        await cluster.idle();
        await cluster.close();

        return E.right(undefined);

    } catch (e) {

        return E.left(e);

    }

};

const writeHtml = (html: string) => (filename: string) => writeData(filename)(html);

const tool = pipe(
    sequenceT(TE.taskEither)(
        readStateAndCounties,
        readElections,
        readIncidents,
    ),
    TE.map(([counties, elections, incidents]) =>
        R.reduce(
            (acc, { state, county, stateCode }) => [...acc, ({
                state,
                county,
                stateCode,
                hasElections: pipe(
                    elections,
                    R.filter<Election>((e) =>
                        e.state === stateCode
                        && e.counties.includes(county)),
                    R.head,
                    Boolean,
                ),
                numIncidents: {
                    state: pipe(
                        incidents,
                        R.filter<Incident>((i) => i.state === stateCode),
                        R.length,
                    ),
                    county: pipe(
                        incidents,
                        R.filter<Incident>((i) => i.state === stateCode && i.county === county),
                        R.length,
                    ),
                },
            })],
            [] as ShareableProps[],
            counties,
        ),
    ),
    TE.map(A.map((data) => ({
        ...data,
        html: pipe(
            React.createElement(Shareable, {
                ...data,
                state: capitalizeAll(data.state),
                stateCode: data.stateCode.toUpperCase(),
                county: capitalizeAll(`${data.county} ${data.stateCode === 'ak'
                    ? 'borough'
                    : data.stateCode === 'la'
                        ? 'parish'
                        : 'county'}`),
            }),
            renderToString,
            inHtml,
        ),
    }))),
    TE.chainFirst((l) => pipe(
        l,
        A.map((img) => pipe(
            `html/${img.state}-${img.county}.html`,
            toFilename,
            writeHtml(img.html),
        )),
        A.chunksOf(10),
        (l) => batchTraverse(TE.taskEither)(l, TE.right),
        TE.chain(A.sequence(TE.taskEitherSeq)),
    )),
    TE.chain((l) => pipe(
        l,
        A.map((img) => toFilename(`${img.state}-${img.county}`)),
        renderHtmlP,
    )),
    TE.chain(() => TE.right('done')),
);

tool().then(console.log, console.warn);
