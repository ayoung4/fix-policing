import { CSSProperties } from 'react';

const base = 0.5;

export const concat: (...cs: CSSProperties[]) => CSSProperties
    = (...cs) => Object.assign({}, ...cs);

export const container: CSSProperties = {
    minHeight: '100vh',
};

export const textCenter: CSSProperties = {
    textAlign: 'center',
};

export const positionRelative: CSSProperties = {
    position: 'relative',
};

export const p1y: CSSProperties = {
    paddingTop: `${base}rem`,
    paddingBottom: `${base}rem`,
};

export const p2y: CSSProperties = {
    paddingTop: `${base * 2}rem`,
    paddingBottom: `${base * 2}rem`,
};

export const p3y: CSSProperties = {
    paddingTop: `${base * 3}rem`,
    paddingBottom: `${base * 3}rem`,
};

export const p4y: CSSProperties = {
    paddingTop: `${base * 4}rem`,
    paddingBottom: `${base * 4}rem`,
};

export const p5y: CSSProperties = {
    paddingTop: `${base * 5}rem`,
    paddingBottom: `${base * 5}rem`,
};

export const p2: CSSProperties = concat(
    p2y,
    {
        paddingLeft: `${base * 2}rem`,
        paddingRight: `${base * 2}rem`,
    },
);

export const m1y: CSSProperties = {
    marginTop: `${base}rem`,
    marginBottom: `${base}rem`,
};

export const m2y: CSSProperties = {
    marginTop: `${base * 2}rem`,
    marginBottom: `${base * 2}rem`,
};

export const m3y: CSSProperties = {
    marginTop: `${base * 3}rem`,
    marginBottom: `${base * 3}rem`,
};

export const m4y: CSSProperties = {
    marginTop: `${base * 4}rem`,
    marginBottom: `${base * 4}rem`,
};

export const m5y: CSSProperties = {
    marginTop: `${base * 5}rem`,
    marginBottom: `${base * 5}rem`,
};

export const flex1: CSSProperties = {
    display: 'flex',
    flex: 1,
};

export const flex2: CSSProperties = {
    display: 'flex',
    flex: 2,
};

export const flex3: CSSProperties = {
    display: 'flex',
    flex: 3,
};

export const flex4: CSSProperties = {
    display: 'flex',
    flex: 4,
};

export const flex5: CSSProperties = {
    display: 'flex',
    flex: 5,
};

export const flex6: CSSProperties = {
    display: 'flex',
    flex: 6,
};

export const flexRow: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
};

export const flexColumn: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

export const justifyContentSpaceBetween: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
};

export const justifyContentCenter: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

export const justifyContentSpaceAround: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
};

export const justifyContentStart: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
};

export const justifyContentEnd: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
};

export const alignItemsCenter: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

export const alignItemsStart: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
};

export const alignItemsEnd: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
};

export const alignItemsBaseline: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
};

export const bkYellow: CSSProperties = {
    backgroundColor: '#EFE91F',
};

export const textBlue: CSSProperties = {
    color: 'blue',
};

export const textRed: CSSProperties = {
    color: 'red',
};

export const vh100: CSSProperties = {
    minHeight: '100vh',
};

export const h100: CSSProperties = {
    minHeight: '100%',
};

export const bordered: CSSProperties = {
    border: '1px solid red',
};
