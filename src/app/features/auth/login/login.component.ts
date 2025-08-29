import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { IUser } from '../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../core/services/user.service';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auth-login',
    imports: [CommonModule, FormsModule, RouterLink, Button, PasswordModule, InputTextModule, MessageModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    private USER_DEFAULT: IUser = {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    };

    public user: IUser = { ...this.USER_DEFAULT };
    public step = 0;
    public error: string | null = null;

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private userService = inject(UserService);

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.step = +params['step'] || 0;
        });
    }

    public changeStep(step: number): void {
        this.step = step;
        this.router.navigate(['auth/login'], { queryParams: { step } });
    }

    public login(): void {
        this.userService.login(this.user.email, this.user.password!).subscribe({
            next: (success: any) => {
                const user = success.user;
                if (user) {
                    this.userService.setUser(user, success.token, success.refresh_token);
                    this.router.navigate(['/playground']);
                }
            },
            error: (err) => {
                console.error(err.error);
                this.error = err.error.error || 'Une erreur est survenue';
            }
        });
    }
}
