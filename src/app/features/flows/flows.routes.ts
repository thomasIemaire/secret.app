import { Routes } from '@angular/router';
import { FlowsComponent } from './flows.component';
import { FlowPreviewComponent } from './flow-preview/flow-preview.component';

export const flowsRoutes: Routes = [
    {
        path: '',
        component: FlowsComponent,
        children: [
            {
                path: ':id',
                component: FlowPreviewComponent
            }
        ]
    }
];
