import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { flows } from '../../../../_db/flows.db';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-flow-preview',
    imports: [CommonModule, FormsModule],
    templateUrl: './flow-preview.component.html',
    styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent {

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

}
