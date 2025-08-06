import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IUser } from './core/models/user.model';
import { UserService } from './core/services/user.service';
import { HeaderComponent } from './shared/components/organisms/header/header.component';
import { SidebarComponent } from "./shared/components/organisms/sidebar/sidebar.component";
import { ThemeService } from './core/services/theme.service';
import { MobileNavigationComponent } from './shared/components/organisms/mobile-navigation/mobile-navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MobileNavigationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {

  public user: IUser | null = null;

  private themeService = inject(ThemeService);
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
 