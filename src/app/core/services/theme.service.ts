import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {

    public theme: 'light' | 'dark' = 'light';

    constructor() {
        const storedTheme = window.localStorage.getItem('theme') as 'light' | 'dark';
        this.theme = storedTheme || this.theme;
        this.setTheme();
    }

    public isDarkMode(): boolean {
        return this.theme === 'dark';
    }

    public toggleTheme(): void {
        this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    private setTheme(theme: 'light' | 'dark' = this.theme): void {
        this.theme = theme;
        window.localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('app-dark', this.isDarkMode());
    }
}