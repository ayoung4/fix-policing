export declare type RegistrationData = {
    deadline: string;
    link: string;
};
export declare type Incident = {
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
    link?: string;
};
export declare type Election = {
    state: string;
    counties: string[];
    type: string;
    recommendedCandidate: string;
    candidates: Candidate[];
};
export declare type Candidate = {
    name: string;
    imageLink: string;
    websiteLink: string;
};
export declare type CountyData = {
    name: string;
    incidents: Incident[];
    elections: Election[];
};
export declare type StateData = {
    name: string;
    registration: RegistrationData;
    counties: CountyData[];
};
export declare type Db = {
    [state: string]: StateData;
};
