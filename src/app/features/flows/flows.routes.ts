import { Routes } from '@angular/router';
import { FlowsComponent } from './flows.component';
import { FlowPreviewComponent } from './flow-preview/flow-preview.component';

export const flowsRoutes: Routes = [
    {
        path: '',
        component: FlowsComponent,
        data: { title: 'Gestion des Flows' },
        children: [
            {
                path: ':id',
                component: FlowPreviewComponent
            }
        ]
    }
];
