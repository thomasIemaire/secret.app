import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "../../molecules/menu/menu.component";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { UserService } from "../../../../core/services/user.service";

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, FormsModule, MenuComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    public userService = inject(UserService);

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
        }
    ];

    public tools: IMenuItem[] = [
        {
            label: 'Logs',
            icon: 'pi pi-code',
            route: '/logs'
        },
        {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            route: '/settings'
        },
        {
            label: this.userService.user?.email || 'Profil',
            icon: 'pi pi-user',
            route: '/profile'
        },
    ];
}