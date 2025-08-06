import { Component } from '@angular/core';
import { flows } from '../../../_db/flows.db';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-flows',
    imports: [CommonModule, FormsModule, TagModule, InputTextModule, SelectModule, ButtonModule],
    templateUrl: './flows.component.html',
    styleUrls: ['./flows.component.scss']
})
export class FlowsComponent {
    public flows = flows;

    public search: string = '';

    public filterOn: string = 'updatedAt';

    public filters: Array<{ [key: string]: string }> = [
        { name: 'Nom', value: 'name' },
        { name: 'État', value: 'status' },
        { name: 'Mis à jour', value: 'updatedAt' }
    ];

    public orderBy: 'asc' | 'desc' = 'desc';

    public toggleOrder() {
        this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
    }

    public get filteredFlows() {
        return this.flows
            .filter(flow => {
                const searchTerm = this.search.toLowerCase();
                return (
                    flow.name.toLowerCase().includes(searchTerm) ||
                    flow.status.toLowerCase().includes(searchTerm) ||
                    flow.files.toString().toLowerCase().includes(searchTerm)
                );
            }
            )
            .sort((a, b) => {
                const aValue = a[this.filterOn];
                const bValue = b[this.filterOn];
                if (this.orderBy === 'asc') {
                    return aValue > bValue ? 1 : -1;
                }

                return aValue < bValue ? 1 : -1;
            });
    }
}
