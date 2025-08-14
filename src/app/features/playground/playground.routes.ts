import { Routes } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { PlaygroundSardineComponent } from './playground-sardine/playground-sardine.component';
import { PlaygroundAgentComponent } from './playground-agent/playground-agent.component';

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
                component: PlaygroundAgentComponent,
                data: { title: 'Tester un Agent' },
                children: [
                    {
                        path: ':agent/:version',
                        component: PlaygroundAgentComponent,
                        data: { title: 'Historique des tests' }
                    }
                ]
            },
            {
                path: 'flow',
                component: PlaygroundComponent,
                data: { title: 'Tester un Flow' },
                children: [
                    {
                        path: ':flow/:version',
                        component: PlaygroundComponent
                    }
                ]
            }
        ]
    }
];
