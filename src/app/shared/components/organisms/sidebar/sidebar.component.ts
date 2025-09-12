import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "../../molecules/menu/menu.component";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { UserService } from "../../../../core/services/user.service";
import { ThemeService } from "../../../../core/services/theme.service";
import { DialogService, DynamicDialogRef, DynamicDialogModule } from "primeng/dynamicdialog";
import { UserDialogComponent } from "../../molecules/user-dialog/user-dialog.component";

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, FormsModule, MenuComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [DialogService]
})
export class SidebarComponent {
    private dialogService: DialogService = inject(DialogService);
    private ref: DynamicDialogRef | undefined;

    private userService = inject(UserService);
    private themeService = inject(ThemeService);

    public navigation: IMenuItem[] = [
        { label: 'Agents', icon: 'pi pi-microchip-ai', route: '/agents' },
        { label: 'Flows', icon: 'pi pi-sitemap', route: '/flows' },
        { label: 'Playground', icon: 'pi pi-sparkles', route: '/playground' }
    ];

    public settings: IMenuItem[] = this.buildSettings();

    private buildSettings(): IMenuItem[] {
        const isDark = this.themeService.isDarkMode();
        return [
            {
                label: isDark ? 'Mode clair' : 'Mode sombre',
                icon: isDark ? 'pi pi-sun' : 'pi pi-moon',
                command: () => this.onToggleTheme()
            },
            {
                label: this.userService.user?.email || 'Profil',
                icon: 'pi pi-user',
                menu: [
                    { label: 'Mon compte', icon: 'pi pi-info-circle', command: () => this.openUserDialog() },
                    { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.userService.logout() }
                ]
            }
        ];
    }

    private onToggleTheme(): void {
        this.themeService.toggleTheme();
        this.settings = this.buildSettings();
    }

    private openUserDialog(): void {
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