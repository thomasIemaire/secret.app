import { Component, Input } from "@angular/core";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-menu-item',
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="menu-item__wrapper" [routerLink]="item.route">
        <i class="menu-item__icon" [ngClass]="item.icon"></i>
        <span class="menu-item__label">{{ item.label }}</span>
    </div>
    `,
    styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
    @Input()
    public item!: IMenuItem;
}
