import { inject, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class TokenService {

    private storage: StorageService = inject(StorageService);

    private readonly TOKEN_KEY = 'token';
    private readonly REFRESH_TOKEN_KEY = 'refresh-token';

    private token: string | null = null;
    private refreshToken: string | null = null;

    constructor() {
        this.token = this.storage.getLocalStorage(this.TOKEN_KEY);
        this.refreshToken = this.storage.getLocalStorage(this.REFRESH_TOKEN_KEY);
    }

    setTokens(token: string | null, refreshToken: string | null): void {
        this.setToken(token);
        this.setRefreshToken(refreshToken);
    }

    setToken(token: string | null): void {
        this.token = token;
        this.storage.setLocalStorage(this.TOKEN_KEY, token);
    }

    setRefreshToken(token: string | null): void {
        this.refreshToken = token;
        this.storage.setLocalStorage(this.REFRESH_TOKEN_KEY, token);
    }

    getToken(): string | null {
        return this.token || this.storage.getLocalStorage(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return this.refreshToken || this.storage.getLocalStorage(this.REFRESH_TOKEN_KEY);
    }

    clearTokens(): void {
        this.token = null;
        this.refreshToken = null;
        this.storage.removeLocalStorage(this.TOKEN_KEY);
        this.storage.removeLocalStorage(this.REFRESH_TOKEN_KEY);
    }
}