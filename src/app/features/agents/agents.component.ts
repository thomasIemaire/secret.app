import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { agents } from '../../../_db/agents.db';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-agents',
    imports: [CommonModule, FormsModule, InputTextModule, SelectModule, ButtonModule, TagModule],
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {
    public agents = agents;

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
}
