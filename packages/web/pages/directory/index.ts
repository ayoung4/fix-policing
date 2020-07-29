import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as R from 'ramda';
import { GetStaticProps } from 'next';

import { StateDirectoryPage, StateDirectoryPageProps } from '../../components/pages/directory/state';
import { getDb } from '../../modules/db';
import { ordString } from 'fp-ts/lib/Ord';
import { capitalizeAll } from '../../modules/util';

export const getStaticProps: GetStaticProps<StateDirectoryPageProps> =
    pipe(
        getDb,
        TE.map(R.keys),
        TE.map((states) => pipe(
            states,
            A.sort(ordString),
            A.map((name) => ({
                name: capitalizeAll(name),
                link: `/directory/${name}`,
            })),
        )),
        TE.map((states) => ({ states })),
        TE.fold(
            () => T.of({
                props: { states: [] },
            }),
            (props) => T.of({ props }),
        ),
    );

export default StateDirectoryPage;
