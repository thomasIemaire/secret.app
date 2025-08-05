import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Button } from 'primeng/button';

import { IUser } from '../../../core/models/user.model';

@Component({
    selector: 'app-auth-register',
    imports: [FormsModule, RouterLink, Button, PasswordModule, InputTextModule],
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
        this.router.navigate(['auth/register'], { queryParams: { step } });
    }

}
