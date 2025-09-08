import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dialog-footer',
    imports: [CommonModule, FormsModule, ButtonModule],
    template: `
    <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
        <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close(true)"></p-button>
    </div>
  `,
    styles: [`
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `],
    standalone: true,
})
export class DialogFooterComponent {

    public ref = inject(DynamicDialogRef);

}