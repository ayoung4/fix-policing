import { Brand } from 'utility-types';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as TE from 'fp-ts/lib/TaskEither';

export type City = Brand<'CITY', string>;
export type StateName = Brand<'STATE_NAME', string>;
export type StateCode = Brand<'STATE_CODE', string>;
export type County = Brand<'COUNTY', string>;
export type Zip = Brand<'ZIP', string>;
export type IPAddress = Brand<'IP_ADDRESS', string>;
export type Latitude = Brand<'LATITUDE', number>;
export type Longitude = Brand<'LONGITUDE', number>;
export type APIKey = Brand<'API_KEY', string>;
export type GlobalPosition = [Latitude, Longitude];

export enum ErrorTypes {
    outsideUS = 'Outside US',
    undeterminedCountry = 'Undetermined Country',
    invalidIP = 'Invalid IP Address',
    unknown = 'Unknown Error',
}

export type LocationError = {
    type: ErrorTypes;
    message: string;
};

export type GPLocation = {
    ip: IPAddress;
    city: City;
    position: GlobalPosition;
};

export type CencusLocation = {
    county: County;
    state: {
        code: StateCode;
        name: StateName;
    };
};

export type Location = {
    city: City;
    state: {
        code: StateCode;
        name: StateName;
    };
    county: County;
    position: GlobalPosition;
};

export type GPLocate = (ip: IPAddress) => RTE.ReaderTaskEither<APIKey, LocationError, GPLocation>;

export type CencusLocate = (position: GlobalPosition) => TE.TaskEither<LocationError, CencusLocation>;

export type GetLocationFromIp = (ip: IPAddress) => RTE.ReaderTaskEither<APIKey, LocationError, Location>;
