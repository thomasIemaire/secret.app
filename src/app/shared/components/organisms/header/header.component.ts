import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { ThemeService } from "../../../../core/services/theme.service";
import { UserService } from "../../../../core/services/user.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MenuItem } from "primeng/api";

@Component({
    selector: 'app-header',
    imports: [CommonModule, FormsModule, Button, BreadcrumbModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public router = inject(Router);
    public route: ActivatedRoute = inject(ActivatedRoute);
    public themeService: ThemeService = inject(ThemeService);
    public userService = inject(UserService);

    public DEFAULT_TITLE = `Bienvenue ${this.userService.user?.shortname}`;

    public title: string = this.DEFAULT_TITLE;
    public breadcrumbs: MenuItem[] = [];

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let route = this.route.firstChild;
                let title = this.DEFAULT_TITLE;

                while (route) {
                    const data = route.snapshot.data;

                    if (data['title']) {
                        title = data['title'];
                    }

                    route = route.firstChild;
                }

                return { title };
            })
        ).subscribe(res => {
            this.title = res.title;
            this.updateCrumbs(this.router.url);
        });
    }

    private updateCrumbs(url: string): void {
        this.breadcrumbs = this.buildCrumbs(url);
    }

    private buildCrumbs(url: string): MenuItem[] {
        // On retire query string et fragment
        const clean = (url || '/').split('#')[0].split('?')[0];

        // Découpe en segments non vides
        const segments = clean.split('/').filter(Boolean);

        let linkAcc = '';
        const items: MenuItem[] = segments.map((raw) => {
            // Retire les matrix params éventuels (;id=123)
            const seg = raw.split(';')[0];

            // Construit le lien cumulatif
            linkAcc += `/${seg}`;

            return {
                label: this.pretty(seg),
                routerLink: linkAcc
            } as MenuItem;
        });

        return items;
    }

    private pretty(input: string): string {
        const dec = decodeURIComponent(input)
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Capitalise chaque mot
        return dec.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
    }
}