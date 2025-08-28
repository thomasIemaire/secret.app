import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { agents } from '../../../_db/agents.db';
import { TagModule } from 'primeng/tag';
import { Router, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
    selector: 'app-agents',
    imports: [CommonModule, FormsModule, RouterOutlet, InputTextModule, SelectModule, ButtonModule, TagModule, AvatarModule, DragDropModule],
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {

    public router: Router = inject(Router);

    public models = agents;
    public modelsGenerated: any[] = [];
    public modelsToTrain: any[] = [];

    public elementDragged: any = null;

    public search: string = '';

    public filterOn: string = 'updatedAt';

    public filters: Array<{ [key: string]: string }> = [
        { name: 'Nom', value: 'name' },
        { name: 'Version', value: 'version' },
        { name: 'Mis à jour', value: 'updatedAt' }
    ];

    public orderBy: 'asc' | 'desc' = 'desc';

    public filtered(list: any[]) {
        return list
            .filter(a => {
                const searchTerm = this.search.toLowerCase();
                return (
                    a.name.toLowerCase().includes(searchTerm)
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

    public toggleOrder() {
        this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
    }

    public onDragStart(agent: any) {
        this.elementDragged = agent;
    }

    public onDragEnd() {
        this.elementDragged = null;
    }

    public onDragOver(ev: DragEvent) {
        (ev.currentTarget as HTMLElement)?.classList.add('dropping');
        ev.preventDefault();
    }

    public onDragLeave(ev: DragEvent) {
        (ev.currentTarget as HTMLElement)?.classList.remove('dropping');
    }

    public onDropToDataset() {
        const agent = this.elementDragged;
        if (agent) {
            this.modelsGenerated.push(agent);
        }
    }

    public onDropToTrain() {
        const agent = this.elementDragged;
        if (agent) {
            this.modelsGenerated = this.modelsGenerated.filter(a => a._id !== agent._id);
            this.modelsToTrain.push(agent);
        }
    }
}
