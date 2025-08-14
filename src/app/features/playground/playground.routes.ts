import { Routes } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundSardineComponent } from './playground-sardine/playground-sardine.component';

export const playgroundRoutes: Routes = [
    {
        path: '',
        component: PlaygroundComponent,
        data: { title: 'Playground' },
        children: [
            {
                path: 'sardine',
                component: PlaygroundSardineComponent,
                data: { title: 'Tester Sardine' },
                children: [
                    {
                        path: ':version',
                        component: PlaygroundSardineComponent
                    }
                ]
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
