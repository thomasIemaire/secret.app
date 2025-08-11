import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-playground',
    imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
    templateUrl: './playground.component.html',
    styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {

    public router: Router = inject(Router);

}
