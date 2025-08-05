import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'agents',
        loadChildren: () => import('./features/agents/agents.routes').then(m => m.agentsRoutes)
    },
    {
        path: 'playground',
        loadChildren: () => import('./features/playground/playground.routes').then(m => m.playgroundRoutes)
    },
    {
        path: 'flows',
        loadChildren: () => import('./features/flows/flows.routes').then(m => m.flowsRoutes)
    },
    {
        path: 'logs',
        loadChildren: () => import('./features/logs/logs.routes').then(m => m.logsRoutes)
    }
];
