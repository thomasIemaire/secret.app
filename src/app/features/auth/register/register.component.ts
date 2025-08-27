import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';
import { IUser } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { Utils } from '../../../core/models/utils.model';

@Component({
    selector: 'app-auth-register',
    imports: [CommonModule, FormsModule, RouterLink, Button, PasswordModule, InputTextModule, MessageModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    private USER_DEFAULT: IUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };

    public user: IUser = { ...this.USER_DEFAULT };
    public step = 0;
    public error: string = '';

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private userService = inject(UserService);

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.step = +params['step'] || 0;
        });
    }

    public changeStep(step: number): void {
        this.error = '';
        this.step = step;
        this.router.navigate(['auth/register'], { queryParams: { step } });
    }

    public emailIsValid(): void {
        this.userService.emailAlreadyExists(this.user.email).subscribe(message => {
            if (message)
                this.error = message;
            else {
                if (this.user.email.includes('@sendoc.fr'))
                    this.sendocEmailAnalysis(this.user.email);
                this.changeStep(2);
            }
        });
    }

    public register(): void {
        this.userService.register(this.user).subscribe(success => {
            if (success)
                this.router.navigate(['/']);
        });
    }

    private sendocEmailAnalysis(email: string): void {
        const names = email.split('@')[0].split('+')[0].split('.');
        if (names.length < 2) return;
        this.user.firstName = Utils.capitalize(names[0]);
        this.user.lastName = Utils.capitalize(names[1]);
    }

}
