import { Utils } from "./utils.model";

export interface IUser {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    token?: string;
}

export class User implements IUser {
    id?: string | undefined;
    firstname: string;
    lastname: string;
    email: string;
    password?: string | undefined;
    token?: string | undefined;

    constructor(user: IUser) {
        this.id = user.id;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.password = user.password;
        this.token = user.token;
    }

    get shortname(): string {
        return `${Utils.capitalize(this.firstname)} ${Utils.capitalize(this.lastname)[0]}.`;
    }

}