import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { flows } from '../../../../_db/flows.db';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'app-flow-preview',
    imports: [CommonModule, FormsModule, Button, SelectButtonModule, OrganizationChartModule],
    templateUrl: './flow-preview.component.html',
    styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent {

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    public flow: any = null;

    public selectPreview: any = {
        options: [
            { label: 'Arborescence', value: 'tree' },
            { label: 'Retour', value: 'return' },
        ],
        value: 'tree'
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.flow = this.findFlowById(params['id']);
        });
    }

    private findFlowById(id: string) {
        return flows.find(flow => flow.id === id);
    }

    public back() {
        this.router.navigate(['/flows']);
    }

    data: TreeNode[] = [
        {
            label: 'F.C Barcelona',
            expanded: true,
            children: [
                {
                    label: 'Argentina',
                    expanded: true,
                    children: [
                        {
                            label: 'Argentina'
                        },
                        {
                            label: 'France'
                        }
                    ]
                },
                {
                    label: 'France',
                    expanded: true,
                    children: [
                        {
                            label: 'France'
                        },
                        {
                            label: 'Morocco'
                        }
                    ]
                }
            ]
        }
    ];
    isPanning = false;
    startX = 0;
    startY = 0;
    translateX = 0;
    translateY = 0;
    scale = .8;
    lastPinchDistance = 0;

    startPan(event: MouseEvent) {
        this.isPanning = true;
        this.startX = event.clientX - this.translateX;
        this.startY = event.clientY - this.translateY;
        event.preventDefault();
    }

    pan(event: MouseEvent) {
        if (!this.isPanning) return;
        this.translateX = event.clientX - this.startX;
        this.translateY = event.clientY - this.startY;
    }

    endPan() {
        this.isPanning = false;
    }

    onWheel(event: WheelEvent) {
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        this.scale = Math.min(Math.max(this.scale + delta, 0.5), 2);
    }

    startPanTouch(event: TouchEvent) {
        if (event.touches.length === 1) {
            // Pan simple avec un doigt
            this.isPanning = true;
            this.startX = event.touches[0].clientX - this.translateX;
            this.startY = event.touches[0].clientY - this.translateY;
        } else if (event.touches.length === 2) {
            // Pinch zoom
            this.isPanning = false;
            this.lastPinchDistance = this.getPinchDistance(event);
        }
    }

    panTouch(event: TouchEvent) {
        if (event.touches.length === 1 && this.isPanning) {
            this.translateX = event.touches[0].clientX - this.startX;
            this.translateY = event.touches[0].clientY - this.startY;
        } else if (event.touches.length === 2) {
            const newDistance = this.getPinchDistance(event);
            const delta = (newDistance - this.lastPinchDistance) / 200; // Ajuste la sensibilité
            this.scale = Math.min(Math.max(this.scale + delta, 0.5), 2);
            this.lastPinchDistance = newDistance;
        }
    }

    private getPinchDistance(event: TouchEvent): number {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

}
