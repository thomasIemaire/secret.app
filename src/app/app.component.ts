import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IUser } from './core/models/user.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App {
  public user: IUser | null = null;
}
