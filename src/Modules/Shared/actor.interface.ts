// Interface representing an actor with an ID and associated roles used for authorization purposes
export interface Actor {

    id: number;
    email: string;
    roles: string[];
}
