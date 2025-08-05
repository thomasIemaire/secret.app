import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { IUser } from '../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-auth-login',
    imports: [FormsModule, RouterLink, Button, PasswordModule, InputTextModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    private USER_DEFAULT: IUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };

    public user: IUser = { ...this.USER_DEFAULT };
    public step = 0;

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            console.log('RegisterComponent initialized with queryParams:', params);
            this.step = +params['step'] || 0;
        });
    }

    public changeStep(step: number): void {
        this.step = step;
        this.router.navigate(['auth/login'], { queryParams: { step } });
    }

}
