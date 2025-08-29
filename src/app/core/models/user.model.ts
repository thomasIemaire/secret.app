import { Utils } from "./utils.model";

export interface IUser {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
}

export class User implements IUser {
    _id?: string | undefined;
    firstname: string;
    lastname: string;
    email: string;
    password?: string | undefined;

    constructor(user: IUser) {
        this._id = user._id;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
        this.email = user.email;
        this.password = user.password;
    }

    get shortname(): string {
        return `${Utils.capitalize(this.firstname)} ${Utils.capitalize(this.lastname)[0]}.`;
    }

}