import { Component, Input } from "@angular/core";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
    selector: 'app-menu-item',
    imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, TieredMenu],
    template: `
    <div 
        class="menu-item__wrapper" 
        [routerLink]="item.route" 
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: false }"
        (click)="item.command ? item.command() : (item.menu ? menu.toggle($event) : null)"
    >
        <i class="menu-item__icon" [ngClass]="item.icon"></i>
        <span class="menu-item__label">{{ item.label }}</span>
    </div>
    <p-tieredmenu #menu [model]="item.menu" [popup]="true" (click)="$event.stopPropagation()"></p-tieredmenu>
    `,
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
    @Input()
    public item!: IMenuItem;
}
