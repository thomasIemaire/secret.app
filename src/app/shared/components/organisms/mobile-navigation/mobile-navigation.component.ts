import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IMenuItem } from "../../../../core/models/menu-item.model";

@Component({
    selector: 'app-mobile-navigation',
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
    templateUrl: './mobile-navigation.component.html',
    styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent {
    public navigation: IMenuItem[] = [
        {
            label: 'Agents',
            icon: 'pi pi-microchip-ai',
            route: '/agents'
        },
        {
            label: 'Flows',
            icon: 'pi pi-sitemap',
            route: '/flows'
        },
        {
            label: 'Playground',
            icon: 'pi pi-sparkles',
            route: '/playground'
        },
        {
            label: 'Logs',
            icon: 'pi pi-code',
            route: '/logs'
        },
        {
            label: 'Profil',
            icon: 'pi pi-user',
            route: '/profile'
        },
    ];
}