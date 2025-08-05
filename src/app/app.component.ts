import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IUser } from './core/models/user.model';
import { UserService } from './core/services/user.service';
import { HeaderComponent } from './shared/components/organisms/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {

  public user: IUser | null = null;

  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      if (!user)
        this.router.navigate(['/auth/login']);
    });
  }
}
 