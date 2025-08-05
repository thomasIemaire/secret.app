import { Component } from '@angular/core';
import { flows } from '../../../_db/flows.db';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-flows',
    imports: [CommonModule, FormsModule, TagModule],
    templateUrl: './flows.component.html',
    styleUrls: ['./flows.component.scss']
})
export class FlowsComponent {
    public flows = flows;
}
