import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';

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
    public option: any = null;

    constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }
}
