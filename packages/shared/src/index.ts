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
    link?: string;
};

export type CountyData = {
    name: string;
    incidents: Incident[];
};

export type StateData = {
    name: string;
    registration: RegistrationData;
    counties: CountyData[];
};

export type Db = { [state: string]: StateData };
