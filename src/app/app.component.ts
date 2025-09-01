import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IUser } from './core/models/user.model';
import { UserService } from './core/services/user.service';
import { HeaderComponent } from './shared/components/organisms/header/header.component';
import { SidebarComponent } from "./shared/components/organisms/sidebar/sidebar.component";
import { ThemeService } from './core/services/theme.service';
import { MobileNavigationComponent } from './shared/components/organisms/mobile-navigation/mobile-navigation.component';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MobileNavigationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {

  public loading: boolean = true;
  public user: IUser | null = null;

  private tokenService = inject(TokenService);
  private themeService = inject(ThemeService);
  private userService = inject(UserService);

  public router = inject(Router);

  ngOnInit(): void {

    this.userService.user$.subscribe(user => {
      this.user = user;
      if (!this.loading && !user && !this.router.url.startsWith('/auth'))
        this.router.navigate(['/auth/login']);
    });

    const token = this.tokenService.getToken();
    if (token)
      this.userService.token(token).subscribe({
        next: (success: any) => {
          const user = success.user;
          if (user) {
            this.userService.setUser(user, success.token, success.refresh_token);
            this.user = this.userService.user;
          }
        },
        error: (err) => {
          console.error(err.error);
          this.router.navigate(['/auth/login']);
          this.tokenService.clearTokens();
        },
        complete: () => {
          this.loading = false;
        }
      });
    else {
      this.router.navigate(['/auth/login']);
      this.loading = false;
    }
  }
}
