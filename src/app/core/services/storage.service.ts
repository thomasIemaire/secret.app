import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class StorageService {

    getLocalStorage(key: string): any {        
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    setLocalStorage(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }

}