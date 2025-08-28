import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

type Entity = { key: string; start: number; end: number };
type Token = { text: string; key?: string };

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DynamicDialogModule, TooltipModule],
    template: `
    <div>
        <div class="dialog-content">
            <div class="example-line">
                <ng-container *ngFor="let t of tokens">
                <span *ngIf="t.key; else plain"
                        class="entity-in-example"
                        [pTooltip]="t.key"
                        tooltipPosition="top">
                    {{ t.text }}
                </span>
                <ng-template #plain>{{ t.text }}</ng-template>
                </ng-container>
            </div>
        </div>

      <div class="dialog-footer">
            <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
            <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close(true)"></p-button>
      </div>
    </div>
  `,
    styles: [`
    .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .example-line {
            display:flex;
            gap:.25rem;
            align-items:center;
            flex-wrap:wrap;
            user-select: none;
            
            .entity-in-example {
                background-color: var(--background-color-200);
                padding: .2rem .4rem;
                border-radius: .3rem;
                font-size: .9rem;
                font-weight: 600;
                cursor: pointer;
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    `]
})
export class ConfirmDatasetDialogComponent {
    constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }

    tokens: Token[] = [];

    ngOnInit() {
        const ex = this.cfg.data?.example;
        this.tokens = this.buildTokens(ex?.text ?? '', ex?.entities ?? []);
    }

    buildTokens(text: string, entities: Entity[]): Token[] {
        if (!text) return [];

        const len = text.length;
        const cleaned = entities
            .map(e => {
                let start = Math.max(0, Math.min(len, e.start ?? 0));
                let end = Math.max(0, Math.min(len, e.end ?? 0));
                if (end < start) [start, end] = [end, start];
                return { key: e.key, start, end };
            })
            .filter(e => e.start < e.end)
            .sort((a, b) => a.start - b.start || a.end - b.end);

        const out: Token[] = [];
        let i = 0;

        for (const e of cleaned) {
            if (e.start < i) continue;

            if (e.start > i) out.push({ text: text.slice(i, e.start) });
            out.push({ text: text.slice(e.start, e.end), key: e.key });
            i = e.end;
        }
        if (i < len) out.push({ text: text.slice(i) });

        return out;
    }
}
