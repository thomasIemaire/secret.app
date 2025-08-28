import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule, DynamicDialogModule],
  template: `
    <div>
      <p>{{ cfg.data?.message }}</p>

      <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
        <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close(true)"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    `]
})
export class ConfirmActionDialogComponent {
  constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }
}
