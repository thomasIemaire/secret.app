import { Component, Input } from "@angular/core";
import { IMenuItem } from "../../../../core/models/menu-item.model";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MenuItemComponent } from "../../atoms/menu-item/menu-item.component";

@Component({
    selector: 'app-menu',
    imports: [CommonModule, FormsModule, MenuItemComponent],
    template: `
    <div class="menu__wrapper">
        <app-menu-item *ngFor="let item of items" [item]="item" />
    </div>
    `,
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
    @Input()
    public items!: IMenuItem[];
}
