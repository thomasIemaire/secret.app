import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DragDropModule } from 'primeng/dragdrop';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectActionDialogComponent } from '../../shared/components/molecules/select-acrion-dialog/select-acrion-dialog.component';
import { ConfirmDatasetDialogComponent } from '../../shared/components/molecules/confirm-dataset-dialog/confirm-dataset-dialog.component';
import { ApiService } from '../../core/services/api.service';
import { AppService } from '../../core/services/app.service';
import { AgentItem } from "./agent-item/agent-item";

@Component({
    selector: 'app-agents',
    imports: [CommonModule, FormsModule, Toast, RouterOutlet, DynamicDialogModule, InputTextModule, SelectModule, ButtonModule, DragDropModule, AgentItem],
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.scss'],
    providers: [MessageService, DialogService]
})
export class AgentsComponent {

    public app: AppService = inject(AppService);
    public api: ApiService = inject(ApiService);
    public router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private messageService: MessageService = inject(MessageService);
    private dialogService: DialogService = inject(DialogService);
    private ref: DynamicDialogRef | undefined;

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

    public displayModels: boolean = true;
    public displayGenerating: boolean = true;
    public displayTraining: boolean = true;
    public displayAgents: boolean = true;

    ngOnInit() {
        this.getModels();
        this.getDatasets();
        this.getAgents();

        this.getActiveTab();

        this.router.events.subscribe(() => {
            this.getActiveTab();
        });

        setInterval(() => {
            this.getDatasets();
        }, 2000);
    }

    public getActiveTab(tab: string | null = this.route.snapshot.queryParamMap.get('tab') || null) {
        this.displayModels = tab ? tab === 'models' : true;
        this.displayGenerating = tab ? tab === 'generating' : true;
        this.displayTraining = tab ? tab === 'training' : true;
        this.displayAgents = tab ? tab === 'agents' : true;
    }

    public getModels() {
        this.api.get('models/').subscribe({
            next: (res: any) => {                
                this.app.models = res;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private lastDatasetCheck: number | null = null;

    public createModel() {
        this.api.post('models/', {}).subscribe({
            next: (res: any) => {
                this.router.navigate([`/agents/${res._id}`], { queryParams: { tab: 'models' } });
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    public getDatasets() {
        this.api.get('datasets/').subscribe({
            next: (res: any) => {
                this.app.datasets.generating = res.filter((d: any) => (d.status === 'generating' || d.status === 'empty'));
                this.app.datasets.generated = res.filter((d: any) => d.status === 'generated');
                this.app.datasets.ready = res.filter((d: any) => d.status === 'ready');
                this.app.datasets.training = res.filter((d: any) => d.status === 'training');

                if (this.lastDatasetCheck !== null && this.lastDatasetCheck > res.length) 
                    this.getAgents();

                this.lastDatasetCheck = res.length;
            },
            error: (err) => {
                // console.error(err);
                this.app.datasets = {
                    generating: [] as any[],
                    generated: [] as any[],
                    ready: [] as any[],
                    training: [] as any[]
                };
            }
        });
    }

    public getAgents() {
        this.api.get('agents/').subscribe({
            next: (res: any) => {
                this.app.agents = res;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    public filtered(list: any[]) {
        if (list.length === 0) return [];
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

    public viewAgent(agent: any, tab: string) {
        this.router.navigate([`/agents/${agent._id}`], { queryParams: { tab: tab } });
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
                    this.app.datasets.generating.push(agent);
                    this.api.post(`models/build/${agent._id}`, { size: res.option }).subscribe(
                        next => {
                            this.getModels();
                        }
                    );
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
                    examples: () => {
                        return this.api.get(`datasets/${agent._id}/examples?size=3`);
                    }
                }
            });

            this.ref.onClose.subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.app.datasets.generated = this.app.datasets.generated.filter((a: any) => a._id !== agent._id);
                    this.app.datasets.ready.push(agent);
                    this.api.post(`datasets/train/${agent._id}`, {}).subscribe();
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
