import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { ApiService } from '../../../../core/services/api.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, DynamicDialogModule, Select],
    template: `
    <div>
        <div class="dialog-content">
            {{ cfg.data?.message }}
            <p-select [options]="cfg.data?.select?.options" [(ngModel)]="option" optionLabel="label"
                optionValue="value" [editable]="true" appendTo="body" [placeholder]="cfg.data?.select?.placeholder"/>
        </div>

      <div class="dialog-footer">
            <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close({ close: false })"></p-button>
            <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close({ close: true, option: option })"
                [disabled]="option == null"></p-button>
      </div>
    </div>
  `,
    styles: [`
    .dialog-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        p-select {
            width: 100%;
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
export class SelectActionDialogComponent {
    private api: ApiService = inject(ApiService);

    public option: any = null;
    public recommended: number | null = null;

    private size = 0;
    public formats = 0;
    public attributes = 0;

    constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) {
    const model = this.cfg.data?.model;
    
        this.api.get(`models/${model._id}`).subscribe((model: any) => {
            this.api.get(`models/configurations/${model.configuration}`).subscribe((configuration: any) => {
                this.size = configuration.possibilities
                this.formats = configuration.formats.length;
                this.attributes = configuration.attributes.length;

                this.recommended = this.recommendedIterations(this.size, this.formats, this.attributes);
                const clampValue = this.clamp(this.recommended);
                this.option = clampValue;

                if (this.cfg.data?.select?.options) {
                    this.cfg.data.select.options = this.cfg.data.select.options.map((opt: any) => {
                        if (opt.value === clampValue) {
                            return { ...opt, label: `${opt.label} (recommandé)` };
                        }
                        return opt;
                    });
                }
            });
        });
    }

    private recommendedIterations(
        P: number,
        F: number,
        A: number,
        k = .3,
        w = .2
    ): number {
        if (P <= 0) return 0;
        F = Math.max(1, Math.floor(F));
        A = Math.max(1, Math.floor(A));

        const L = Math.max(1, Math.floor(P / F) / 2 | 0);

        const log2 = (x: number) => Math.log2(Math.max(1, x));
        const tRaw = 1 - Math.exp(-k * (log2(F) + w * log2(A)));
        const t = Math.min(1, Math.max(0, tRaw));

        const N = Math.round(L + t * (P - L));
        return Math.min(P, Math.max(L, N));
    }

    private clamp(value: number): string {
        if (value <= this.size / this.formats / 5) return 'tiny';
        if (value <= this.size / this.formats / 2) return 'small';
        if (value <= this.size / this.formats) return 'recommended';
        if (value <= this.size / 2) return 'advanced';
        return 'complete';
    }
}
