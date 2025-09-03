import { Routes } from '@angular/router';
import { AgentsComponent } from './agents.component';
import { AgentPreview } from './agent-preview/agent-preview';

export const agentsRoutes: Routes = [
    {
        path: '',
        component: AgentsComponent,
        children: [
            {
                path: ':id',
                component: AgentPreview
            }
        ]
    }
];
