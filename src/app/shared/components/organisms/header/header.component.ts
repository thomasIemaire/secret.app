import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { ThemeService } from "../../../../core/services/theme.service";
import { UserService } from "../../../../core/services/user.service";

@Component({
    selector: 'app-header',
    imports: [CommonModule, FormsModule, Button],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public themeService: ThemeService = inject(ThemeService);
    public userService = inject(UserService);

}