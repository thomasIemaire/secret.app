import { Injectable } from "@angular/core";
import { IUser } from "../models/user.model";
import { users } from "../../../_db/users.db";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserService {
    public user: IUser | null = null;
    public user$ = new BehaviorSubject<IUser | null>(null);

    constructor() {
        // this.login('thomas.lemaire@sendoc.fr', 'Sendoc24!');
    }

    login(email: string, password: string): Observable<boolean> {
        const user = users.find((u: IUser) => u.email === email && u.password === password);
        if (user) {
            this.user = user;
            this.user$.next(user);
            return of(true);
        }
        return of(false);
    }

    register(user: IUser): Observable<boolean> {
        user.id = (users.length + 1).toString();
        users.push(user);
        this.user = user;
        this.user$.next(user);
        return of(true);
    }

    logout(): void {
        this.user = null;
        this.user$.next(null);
    }
}