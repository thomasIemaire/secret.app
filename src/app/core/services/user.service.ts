import { Injectable } from "@angular/core";
import { IUser, User } from "../models/user.model";
import { users } from "../../../_db/users.db";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Utils } from "../models/utils.model";

@Injectable({ providedIn: 'root' })
export class UserService {
    public user: User | null = null;
    public user$ = new BehaviorSubject<IUser | null>(null);

    constructor() {
        this.login('thomas.lemaire@sendoc.fr', 'Sendoc24!');
    }

    emailAlreadyExists(email: string): Observable<string> {
        if (!Utils.emailIsValid(email))
            return of('Cette adresse e-mail n\'est pas valide');
        const userExists = users.some((u: IUser) => u.email === email);
        return of(userExists ? 'Cette adresse e-mail est déjà utilisée' : '');
    }

    login(email: string, password: string): Observable<boolean> {
        const user = users.find((u: IUser) => u.email === email && u.password === password);
        if (user) {
            this.user = new User(user);
            this.user$.next(this.user);
            return of(true);
        }
        return of(false);
    }

    register(user: IUser): Observable<boolean> {
        user.id = (users.length + 1).toString();
        users.push(user);
        this.user = new User(user);
        this.user$.next(user);
        return of(true);
    }

    logout(): void {
        this.user = null;
        this.user$.next(null);
    }
}