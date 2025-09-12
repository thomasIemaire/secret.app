import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserService } from "../../../../core/services/user.service";
import { UserDialogComponent } from "../../molecules/user-dialog/user-dialog.component";
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
    selector: 'app-mobile-navigation',
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, TieredMenu],
    templateUrl: './mobile-navigation.component.html',
    styleUrls: ['./mobile-navigation.component.scss'],
    providers: [DialogService]
})
export class MobileNavigationComponent {
    private dialogService: DialogService = inject(DialogService);
    private ref: DynamicDialogRef | undefined;

    private userService = inject(UserService);

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
            label: 'Profil',
            icon: 'pi pi-user',
            menu: [
                { label: 'Mon compte', icon: 'pi pi-info-circle', command: () => this.openUserDialog() },
                { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.userService.logout() }
            ]
        }
    ];

    private openUserDialog(): void {
        console.log('Opening user dialog');
        this.ref = this.dialogService.open(UserDialogComponent, {
            header: "Informations utilisateur",
            width: '400px',
            contentStyle: { overflow: 'auto' },
            modal: true,
            appendTo: 'body',
            data: {}
        });
    }
}