import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../../../../core/services/api.service';
import { ConfigurationForm } from "../../configuration-form";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DynamicDialogModule, ConfigurationForm],
  template: `
    <div *ngIf="loaded; else loadingTpl">
      <div class="form__wrapper">
        <div class="group-inputs">
          <app-configuration-form />
        </div>
      </div>

      <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
        <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close(true)"></p-button>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="form__wrapper">Chargement…</div>
      <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Fermer" (click)="ref.close(false)"></p-button>
      </div>
    </ng-template>
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
export class ConfigurationDialog implements OnInit {

  public loaded = false;

  private api: ApiService = inject(ApiService);

  constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }

  ngOnInit(): void {
  }
}
