import { Component, Input } from "@angular/core";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MenuItemComponent } from "../../atoms/menu-item/menu-item.component";
import { TooltipModule } from "primeng/tooltip";

@Component({
    selector: 'app-menu',
    imports: [CommonModule, FormsModule, MenuItemComponent, TooltipModule],
    template: `
    <div class="menu__wrapper">
        <app-menu-item *ngFor="let item of items" [item]="item" [pTooltip]="item.tooltip ? item.label : undefined" />
    </div>
    `,
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    @Input()
    public items!: IMenuItem[];
}
