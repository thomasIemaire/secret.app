import { inject, Injectable } from "@angular/core";
import { IUser, User } from "../models/user.model";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { Utils } from "../models/utils.model";
import { ApiService } from "./api.service";
import { TokenService } from "./token.service";

@Injectable({ providedIn: 'root' })
export class UserService {

    private tokenService: TokenService = inject(TokenService);

    public user: User | null = null;
    public user$ = new BehaviorSubject<IUser | null>(null);

    private api: ApiService = inject(ApiService);

    constructor() { }

    setUser(user: any | User | null, token?: string, refreshToken?: string): void {
        this.user = user ? new User(user) : null;
        this.user$.next(this.user);
        if (token || refreshToken) {
            this.tokenService.setTokens(token!, refreshToken!);
        }
    }

    emailAlreadyExists(email: string): Observable<string> {
        if (!Utils.emailIsValid(email))
            return of('Cette adresse e-mail n\'est pas valide');
        return this.api.get<{ exists: boolean }>(`auth/email-exists?email=${encodeURIComponent(email)}`).pipe(
            map(res => res.exists ? 'Cette adresse e-mail est déjà utilisée' : '')
        );
    }

    login(email: string, password: string): Observable<any> {
        return this.api.post('auth/login', { email, password })
    }

    register(user: IUser): Observable<any> {
        return this.api.post('auth/register', user)
    }

    logout(): void {
        this.user = null;
        this.user$.next(null);
        this.tokenService.clearTokens();
    }

    token(token: string | null): Observable<any> {
        if (!token)
            return of(null);
        return this.api.post('auth/token', {});
    }
}