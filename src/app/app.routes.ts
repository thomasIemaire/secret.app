import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'agents',
        loadChildren: () => import('./features/agents/agents.routes').then(m => m.agentsRoutes)
    }
];
