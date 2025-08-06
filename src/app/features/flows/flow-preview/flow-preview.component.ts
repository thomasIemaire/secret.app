import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { flows } from '../../../../_db/flows.db';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-flow-preview',
    imports: [CommonModule, FormsModule, Button],
    templateUrl: './flow-preview.component.html',
    styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent {

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    public flow: any = null;

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
}
