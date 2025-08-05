import { Routes } from '@angular/router';
import { LogsComponent } from './logs.component';

export const logsRoutes: Routes = [
    {
        path: '',
        component: LogsComponent,
        children: []
    }
];
