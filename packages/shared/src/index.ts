export type RegistrationData = {
    deadline: string;
    link: string;
};

export type Incident = {
    id: string;
    name: string;
    date: string;
    cause: string;
    armed: string;
    age: number;
    gender: string;
    race: string;
    mentalIllness: boolean;
    threat: string;
    fleeing: boolean;
    bodyCamera: boolean;
    city: string;
    county: string;
    link?: string;
};

export type Election = {
    state: string;
    counties: string[];
    type: string;
    recommendedCandidate: string;
    candidates: Candidate[];
};

export type Candidate = {
    name:string;
    imageLink: string;
    websiteLink: string;
};

export type CountyData = {
    name: string;
    incidents: Incident[];
    elections: Election[];
};

export type StateData = {
    name: string;
    incidents: Incident[];
    registration: RegistrationData;
    counties: CountyData[];
};

export type Db = { [state: string]: StateData };
