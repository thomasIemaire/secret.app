import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Router, RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { DragDropModule } from 'primeng/dragdrop';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectActionDialogComponent } from '../../shared/components/molecules/select-acrion-dialog/select-acrion-dialog.component';
import { ConfirmDatasetDialogComponent } from '../../shared/components/molecules/confirm-dataset-dialog/confirm-dataset-dialog.component';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-agents',
    imports: [CommonModule, FormsModule, Toast, RouterOutlet, DynamicDialogModule, InputTextModule, SelectModule, ButtonModule, TagModule, AvatarModule, DragDropModule],
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
    providers: [MessageService, DialogService]
})
export class AgentsComponent {

    private api: ApiService = inject(ApiService);
    public router: Router = inject(Router);
    private messageService: MessageService = inject(MessageService);
    private dialogService: DialogService = inject(DialogService);
    private ref: DynamicDialogRef | undefined;

    public models: any[] = [];
    public modelsGenerated: any[] = [];
    public modelsToTrain: any[] = [];

    public elementDragged: any = null;
    public draggedFrom: 'models' | 'generated' | null = null;

    public search: string = '';

    public filterOn: string = 'name';

    public filters: Array<{ [key: string]: string }> = [
        { name: 'Nom', value: 'name' },
        { name: 'Référence', value: 'reference' },
        { name: 'Version', value: 'version' },
        { name: 'Mise à jour', value: 'updated_at' },
        { name: 'Création', value: 'created_at' },
    ];

    public orderBy: 'asc' | 'desc' = 'desc';

    ngOnInit() {
        this.getModels();
    }

    public getModels() {
        this.api.get('models/').subscribe({
            next: (res: any) => {                
                this.models = res;
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de récupérer les modèles.' });
            }
        });
    }

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

    public viewAgent(agent: any) {
        console.log('Viewing agent', agent);
    }

    public toggleOrder() {
        this.orderBy = this.orderBy === 'asc' ? 'desc' : 'asc';
    }

    public onDragStart(agent: any, from: 'models' | 'generated') {
        this.elementDragged = agent;
        this.draggedFrom = from;
    }

    public onDragEnd() {
        this.elementDragged = null;
        this.draggedFrom = null;
        document.querySelectorAll('.dropping').forEach(el => el.classList.remove('dropping'));
        document.querySelectorAll('.dropping-error').forEach(el => el.classList.remove('dropping-error'));
    }

    public onDragOver(ev: DragEvent, allowedFrom: string[]) {
        if (this.draggedFrom && !allowedFrom.includes(this.draggedFrom)) {
            (ev.currentTarget as HTMLElement)?.classList.add('dropping-error');
        } else {
            (ev.currentTarget as HTMLElement)?.classList.add('dropping');
        }
        ev.preventDefault();
    }

    public onDragLeave(ev: DragEvent) {
        (ev.currentTarget as HTMLElement)?.classList.remove('dropping');
        (ev.currentTarget as HTMLElement)?.classList.remove('dropping-error');
    }

    public onDropToDataset() {
        if (this.draggedFrom !== 'models') {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Vous devez ajouter un modèle.' });
            return;
        }

        const agent = this.elementDragged;
        if (agent) {
            this.ref = this.dialogService.open(SelectActionDialogComponent, {
                header: "Confirmer la génération des données",
                width: '400px',
                contentStyle: { overflow: 'auto' },
                modal: true,
                appendTo: 'body',
                data: { 
                    select: {
                        placeholder: 'Sélectionner la taille du jeu de données',
                        options: [
                            { label: 'Complet', value: 'complete' },
                            { label: 'Avancé', value: 'advanced' },
                            { label: 'Recommandé', value: 'recommended' },
                            { label: 'Petit', value: 'small' },
                            { label: 'Minuscule', value: 'tiny' }
                        ]
                    }
                }
            });

            this.ref.onClose.subscribe((res: any) => {
                if (res?.close) {
                    this.modelsGenerated.push(agent);
                    // this.addModelToDataset(agent);
                }
            });
        }
    }

    public onDropToTrain() {
        if (this.draggedFrom !== 'generated') {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Vous devez ajouter un modèle généré.' });
            return;
        }

        const agent = this.elementDragged;
        if (agent) {
            this.ref = this.dialogService.open(ConfirmDatasetDialogComponent, {
                header: "Valider le jeu de données",
                width: '400px',
                contentStyle: { overflow: 'auto' },
                modal: true,
                appendTo: 'body',
                data: {
                    example: {
                        "entities": [
                            {
                                "key": "name",
                                "start": 14,
                                "end": 18,
                            },
                            {
                                "key": "age",
                                "start": 26,
                                "end": 28,
                            }
                        ],
                        "text": "Quel age as-tu Joe ? J'ai 35 ans"
                    }
                }
            });

            this.ref.onClose.subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.modelsGenerated = this.modelsGenerated.filter(a => a._id !== agent._id);
                    this.modelsToTrain.push(agent);
                    // this.startTraining(agent);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }
}
