import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { BehaviorSubject } from 'rxjs';
import { SelectModule } from 'primeng/select';

type DataState = { agent: any; version: string; value: string; };

@Component({
    selector: 'app-playground-agent',
    imports: [CommonModule, FormsModule, RouterLink, Button, TextareaModule, SelectModule],
    templateUrl: './playground-agent.component.html',
    styleUrls: ['./playground-agent.component.scss'],
    standalone: true,
})
export class PlaygroundAgentComponent {

    public router: Router = inject(Router);

    public step = 0;

    public agents: any[] = [
        { label: 'Agent 1', versions: ['latest', '1.0', '2.0', '3.0'] },
        { label: 'Agent 2', versions: ['latest', '1.0'] },
        { label: 'Agent 3', versions: ['latest'] }
    ];

    public data$ = new BehaviorSubject<DataState>({
        agent: {},
        version: '',
        value: '',
    });

    ngOnInit(): void {
        const tree = this.router.parseUrl(this.router.url);
        const segments = tree.root.children['primary']?.segments.map(s => s.path) ?? [];
        const queryParams = tree.queryParams;

        const agentIndex = segments.indexOf('agent') + 1;
        const versionIndex = agentIndex + 1;

        const agentSlug = segments[agentIndex];
        const versionSlug = segments[versionIndex];

        const agent = this.agents.find(a => a.label === agentSlug);

        if (agent) {
            const version = agent.versions.includes(versionSlug) ? versionSlug : agent.versions[0];
            this.data$.next({
                agent,
                version,
                value: queryParams['value'] || ''
            });
        } else {
            this.onAgentChange(this.agents[0]);
        }
    }

    onAgentChange(agent: any): void {
        this.data$.next({ ...this.data$.value, agent, version: agent.versions[0], value: '' });
    }

    onValueChange(value: string): void {
        this.data$.next({ ...this.data$.value, value });
    }

    public sendTest(): void {
        const { agent, version, value } = this.data$.value;
        this.router.navigate([`playground/agent/${agent.label}/${version}`], {
            queryParams: { value }
        });
    }

}
