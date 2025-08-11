import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "../../molecules/menu/menu.component";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { UserService } from "../../../../core/services/user.service";
import { ProgressBarModule } from 'primeng/progressbar';
import { Tag } from "primeng/tag";
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { interval } from "rxjs";

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, FormsModule, MenuComponent, ProgressBarModule, Tag, TooltipModule, ConfirmPopupModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class SidebarComponent implements OnInit {

    public userService = inject(UserService);
    private confirmationService: ConfirmationService = inject(ConfirmationService);
    private messageService: MessageService = inject(MessageService);

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

    private intervalId?: number;

    ngOnInit(): void {
        this.startInterval();
    }

    private startInterval(): void {
        this.clearInterval();
        this.intervalId = window.setInterval(() => {
            this.setAgent(this.agent + 1);
        }, 5000);
    }

    private clearInterval(): void {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    public setAgent(index: number): void {
        if (index < 0) this.agent = this.agents.length - 1;
        else this.agent = index % this.agents.length;
        this.startInterval();
    }

    public stopTraining(event: Event) {
        this.confirmationService.confirm({
            target: event.currentTarget as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
}