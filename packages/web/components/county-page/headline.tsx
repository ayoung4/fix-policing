import * as React from 'react';
import { Header } from 'semantic-ui-react';

type Props = {
    numIncidents: number;
    county: string;
    state: string;
};

export const Headline: React.FC<Props> =
    ({ numIncidents, county, state }) =>
        <Header size='huge' textAlign='center'>
            Since 2015, there {numIncidents === 1 ? 'has' : 'have'} been&nbsp;
            {numIncidents} fatal shooting{numIncidents === 1 ? '' : 's'} by&nbsp;
            a police officer in the line of duty in {county} County, {state}.
        </Header>