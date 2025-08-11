import { Routes } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundSardineComponent } from './playground-sardine/playground-sardine.component';

export const playgroundRoutes: Routes = [
    {
        path: '',
        component: PlaygroundComponent,
        children: [
            {
                path: 'sardine',
                component: PlaygroundSardineComponent
            },
            {
                path: 'agent',
                component: PlaygroundComponent
            },
            {
                path: 'flow',
                component: PlaygroundComponent
            }
        ]
    }
];
