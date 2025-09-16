import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { BehaviorSubject } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TooltipModule } from 'primeng/tooltip';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JsonViewerComponent } from '../../../shared/components/atoms/json-viewer/json-viewer.component';
import { ApiService } from '../../../core/services/api.service';

type DataState = { agent: any; version: string; value: string; };
type HistoryItem = { sender: 'ai' | 'me'; content: string | any };

@Component({
    selector: 'app-playground-agent',
    imports: [CommonModule, FormsModule, RouterLink, Button, TextareaModule, SelectModule, TextFieldModule, TooltipModule, Toast, JsonViewerComponent],
    templateUrl: './playground-agent.component.html',
    styleUrls: ['./playground-agent.component.scss'],
    providers: [MessageService],
    standalone: true,
})
export class PlaygroundAgentComponent {

    public api: ApiService = inject(ApiService);
    public router: Router = inject(Router);
    private messageService: MessageService = inject(MessageService);

    public messageSended: boolean = false;
    public step = 0;

    public agents: any[] = [];

    public data$ = new BehaviorSubject<DataState>({
        agent: {},
        version: '',
        value: '',
    });

    public history: HistoryItem[] = [
        { sender: 'me', content: 'Thomas Lemaire\n464 Boulevard des Tamaris\nOnet Le Chateau\n12850\nFrance' },
        {
            sender: 'ai', content: {
                "customer": {
                    "address": {
                        "name": "Thomas Lemaire",
                        "street": "464 Boulevard des Tamaris",
                        "city": "Onet Le Chateau",
                        "zip_code": "12850",
                        "country": "France"
                    }
                }
            }
        },
        {
            sender: 'ai', content: {
                "lines": [
                    { "product": "Souris sans fil", "quantity": 1, "price": 29.99, "total": 29.99 },
                    { "product": "Clavier mécanique", "quantity": 1, "price": 99.99, "total": 99.99 },
                    { "product": "Webcam HD", "quantity": 1, "price": 79.99, "total": 79.99 },
                    { "product": "Support de moniteur", "quantity": 1, "price": 49.99, "total": 49.99 },
                    { "product": "Écran 27 pouces", "quantity": 2, "price": 129.99, "total": 259.98 }
                ]
            }
        },
    ];

    ngOnInit(): void {
        let tests = {
            "address": {
                "1.0": "123",
                "1.2": "456",
            },
            "vat-number": {
                "1.0": "FR12345678901",
                "2.0": "FR98765432109",
            }
        }

        for (const [key, value] of Object.entries(tests)) {
            let versions = [];
            for (const [version, id] of Object.entries(value)) {
                versions.push({ version, id });
            }
            this.agents.push({ label: key, versions });
        }

        this.api.get('agents/list').subscribe((agents: any) => {
            this.fromURI();
        });
    }

    fromURI(): void {
        const tree = this.router.parseUrl(this.router.url);
        const segments = tree.root.children['primary']?.segments.map(s => s.path) ?? [];
        const queryParams = tree.queryParams;

        const agentIndex = segments.indexOf('agent') + 1;
        const versionIndex = agentIndex + 1;

        const agentSlug = decodeURIComponent(segments[agentIndex] || '').trim();
        const versionSlug = decodeURIComponent(segments[versionIndex] || '').trim();

        const agent = this.agents.find(a => String(a.label) === agentSlug);

        if (agent) {
            const versionMatch = agent.versions.find((v: string) => String(v) === versionSlug);
            this.data$.next({
                agent,
                version: versionMatch ?? String(agent.versions[0]),
                value: queryParams['value'] || ''
            });
        } else {
            this.onAgentChange(this.agents[0]);
        }

        this.data$.subscribe(data => {
            this.updateUrl();
        });
    }

    onAgentChange(agent: any): void {
        this.data$.next({ ...this.data$.value, agent, version: agent.versions[0] });
    }

    onVersionChange(version: string): void {
        this.data$.next({ ...this.data$.value, version });
    }

    onValueChange(value: string): void {
        this.data$.next({ ...this.data$.value, value });
    }

    public sendTest(): void {
        this.messageSended = true;
        this.updateUrl();
    }

    private updateUrl(): void {
        const { agent, version, value } = this.data$.value;
        this.router.navigate([`playground/agent/${agent.label}/${version}`], {
            queryParams: { value }
        });
    }

    public share(value: string): void {
        const { agent, version } = this.data$.value;
        const url = `${window.location.origin}/playground/agent/${agent.label}/${version}?value=${encodeURIComponent(value)}`;

        navigator.clipboard.writeText(url).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lien copié dans le presse-papiers' });
        }).catch(err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la copie du lien' });
        });
    }

    public copy(value: string): void {
        navigator.clipboard.writeText(value).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Texte copié dans le presse-papiers' });
        }).catch(err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la copie du texte' });
        });
    }

    public copyJson(json: any): void {
        navigator.clipboard.writeText(JSON.stringify(json)).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'JSON copié dans le presse-papiers' });
        }).catch(err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Échec de la copie du JSON' });
        });
    }

    public reply(value: string): void {
        this.data$.next({ ...this.data$.value, value });
    }
}
