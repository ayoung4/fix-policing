import * as TE from 'fp-ts/lib/TaskEither';
import * as IO from 'fp-ts/lib/IO';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';

import { promises as fs } from 'fs';
import * as R from 'ramda';
import * as _ from 'lodash';

export const capitalizeAll = _.memoize(R.pipe(
    R.split(' '),
    R.map(_.capitalize),
    R.join(' '),
));

export const readData = (filename: string) =>
    TE.tryCatch(
        () => fs.readFile(`${process.cwd()}/input/${filename}`, 'utf8'),
        (reason) => new Error(String(reason)),
    );

export const writeData = (filename: string) => (content: string) =>
    TE.tryCatch(
        () => fs.writeFile(`${process.cwd()}/output/${filename}`, content, 'utf8'),
        (reason) => new Error(String(reason)),
    );

export const parseJSON =
    <T>(content: string) => pipe(
        E.parseJSON(content, (reason) => new Error(String(reason))),
        TE.fromEither,
    ) as TE.TaskEither<Error, T>;

export const stringifyJSON = (obj: any) =>
    pipe(
        E.stringifyJSON(obj, (reason) => new Error(String(reason))),
        TE.fromEither,
    );

export const parseCSV = R.pipe(
    R.toLower,
    R.split('\n'),
    R.tail,
    R.map(R.split(',')),
    R.map(R.map(R.trim)),
);

export const parseTSV = R.pipe(
    R.toLower,
    R.split('\n'),
    R.tail,
    R.map(R.split('\t')),
    R.map(R.map(R.trim)),
);


// states-and-counties.csv format:
// City, State abv, State, County

export const readStateAndCounties = pipe(
    readData('states-and-counties.csv'),
    TE.map(parseCSV),
    TE.map(R.uniqBy((line) => line[3])),
    TE.map(R.map(([city, stateCode, state, county]) => ({
        state,
        county,
        city,
        stateCode,
    }))),
);

// registration.csv format:
// State, Deadline, Link to Register

export const readRegistration = pipe(
    readData('registration.csv'),
    TE.map(parseCSV),
    TE.map(R.map(([state, deadline, link]) => ({
        state,
        deadline,
        link,
    }))),
);

const expandRace = (r: string) =>
    r === 'b'
        ? 'black'
        : r === 'w'
            ? 'white'
            : r === 'a'
                ? 'asian'
                : r === 'h'
                    ? 'hispanic'
                    : '';

const expandGender = (g: string) =>
    g === 'm'
        ? 'man'
        : g === 'f'
            ? 'woman'
            : 'person';

const santitizeName = R.pipe(
    R.replace(/"/g, ''),
    capitalizeAll,
);

// incidents.csv format:
// id, name, date, manner_of_death, armed, age, gender, race,
// city, state, signs_of_mental_illness, threat_level, flee,

// body_camera, County

export const readIncidents = pipe(
    readData('incidents.csv'),
    TE.map(parseCSV),
    TE.map(R.map(([
        id,
        name,
        date,
        cause,
        armed,
        age,
        gender,
        race,
        city,
        state,
        mentalIllness,
        threat,
        fleeing,
        bodyCamera,
        county,
    ]) => ({
        id,
        name: name === 'tk tk'
            ? 'Name Not Provided'
            : santitizeName(name || ''),
        date,
        cause,
        armed,
        age: Number(age),
        gender: expandGender(gender || ''),
        race: expandRace(race || ''),
        city: capitalizeAll(city || ''),
        state: R.toLower(state || ''),
        mentalIllness: Boolean(mentalIllness),
        threat,
        fleeing: Boolean(fleeing),
        bodyCamera: Boolean(bodyCamera),
        county: county || '',
    }))),
);

// elections.tsv format:
// State, Countys, Upcoming elections, Recommended Candidate, 
// Candidate (I), Candidate (I): Image link, Candidate (I): Website, 
// Candidate (C), Candidate (C): Image link, Candidate (C): Website,	
// Candidate (C2), Candidate (C2): Image link, Candidate (C2): Website,	
// Candidate (C3), Candidate (C3): Image link, Candidate (C3): Website,	
// Candidate (C4), Candidate (C4): Image link, Candidate (C4): Website,	
// Candidate (C5), Candidate (C5): Image link, Candidate (C5): Website,	
// Candidate (C6), Candidate (C6): Image link, Candidate (C6): Website,	
// Candidate (C7), Candidate (C7): Image link, Candidate (C7): Website,	
// Candidate (C8), Candidate (C8): Image link, Candidate (C8): Website,	
// Candidate (C9), Candidate (C9): Image link, Candidate (C9): Website,	
// Candidate (C10),	Candidate (C10): Image link, Candidate (C10): Website

export const readElections = pipe(
    readData('elections.tsv'),
    TE.map(parseTSV),
    TE.map(R.map(([
        state, counties, type, recommendedCandidate,
        i, iImage, iWebsite,
        c1, c1Image, c1Website,
        c2, c2Image, c2Website,
        c3, c3Image, c3Website,
        c4, c4Image, c4Website,
        c5, c5Image, c5Website,
        c6, c6Image, c6Website,
        c7, c7Image, c7Website,
        c8, c8Image, c8Website,
        c9, c9Image, c9Website,
        c10, c10Image, c10Website,
    ]) => ({
        state,
        counties: pipe(
            R.split(',', counties),
            R.map(R.trim),
        ),
        type,
        recommendedCandidate,
        candidates: pipe(
            R.filter(
                ([name]) => !!name,
                [
                    [i, iImage, iWebsite],
                    [c1, c1Image, c1Website],
                    [c2, c2Image, c2Website],
                    [c3, c3Image, c3Website],
                    [c4, c4Image, c4Website],
                    [c5, c5Image, c5Website],
                    [c6, c6Image, c6Website],
                    [c7, c7Image, c7Website],
                    [c8, c8Image, c8Website],
                    [c9, c9Image, c9Website],
                    [c10, c10Image, c10Website],
                ] as [string, string, string][],
            ),
            R.map(([name, imageLink, websiteLink]) => ({
                name: santitizeName(name),
                imageLink,
                websiteLink,
            })),
        ),
    }))),
);

const states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];

export const abbreviateState = (state: string) => {
    const input = state.replace(/\w\S*/g, function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    for (let i = 0; i < states.length; i++) {
        if (states[i][0] == input) {
            return (states[i][1]);
        }
    }
    return '';
};

export const expandState = (code: string) => {
    const input = code.toUpperCase();
    for (let i = 0; i < states.length; i++) {
        if (states[i][1] == input) {
            return (states[i][0]);
        }
    }
    return '';
};