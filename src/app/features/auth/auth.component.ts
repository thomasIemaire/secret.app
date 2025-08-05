import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
    selector: 'app-auth',
    imports: [RouterOutlet],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    private router = inject(Router);
    private userService = inject(UserService);

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            if (user)
                this.router.navigate(['/']);
            else
                this.router.navigate(['/auth/login']);
        });
    }
}
