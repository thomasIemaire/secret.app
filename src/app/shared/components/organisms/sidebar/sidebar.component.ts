import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "../../molecules/menu/menu.component";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { UserService } from "../../../../core/services/user.service";
import { ProgressBarModule } from 'primeng/progressbar';
import { Tag } from "primeng/tag";
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, FormsModule, MenuComponent, ProgressBarModule, Tag, TooltipModule],
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
        },
        {
            label: 'Logs',
            icon: 'pi pi-code',
            route: '/logs'
        }
    ];

    public tools: IMenuItem[] = [
        {
            label: 'Logs',
            icon: 'pi pi-code',
            route: '/logs'
        },
        {
            label: this.userService.user?.email || 'Profil',
            icon: 'pi pi-user',
            route: '/profile'
        },
    ];

    public agents: any = [
        {
            name: 'Agent 1',
            progress: 75,
            version: '1.0'
        },
        {
            name: 'Agent 2',
            progress: 50,
            version: '1.2'
        },
        {
            name: 'Agent 3',
            progress: 25,
            version: '2.3'
        }
    ];

    public agent: number = 0;

    public setAgent(index: number): void {
        if (index < 0)
            this.agent = this.agents.length - 1;
        else
            this.agent = index % this.agents.length;
    }
}