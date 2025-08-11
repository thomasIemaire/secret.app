import { Utils } from "./utils.model";

export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    token?: string;
}

export class User implements IUser {
    id?: string | undefined;
    firstName: string;
    lastName: string;
    email: string;
    password?: string | undefined;
    token?: string | undefined;

    constructor(user: IUser) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.token = user.token;
    }

    get shortname(): string {
        return `${Utils.capitalize(this.firstName)} ${Utils.capitalize(this.lastName)[0]}.`;
    }

}