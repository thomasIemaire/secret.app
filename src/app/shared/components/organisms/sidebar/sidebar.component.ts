import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "../../molecules/menu/menu.component";
import { IMenuItem } from "../../../../core/models/menu-item.model";

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, FormsModule, MenuComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
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
}