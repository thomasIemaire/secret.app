import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../../../../../core/services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DynamicDialogModule, InputText, Textarea],
  template: `
    <div *ngIf="loaded; else loadingTpl">
      <div class="form__wrapper">
        <div class="group-inputs">
          <input pInputText pSize="small" [(ngModel)]="data.name" placeholder="Nom" />
        </div>

        <div class="group-inputs">
          <textarea pInputTextarea [(ngModel)]="dataRaw" rows="10" placeholder="Données (JSON)"></textarea>
        </div>

        <small *ngIf="jsonError" style="color:#d32f2f">
          {{ jsonError }}
        </small>
      </div>

      <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
        <p-button size="small" severity="secondary" label="Confirmer" [disabled]="!!jsonError" (click)="onConfirm()"></p-button>
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

    .form__wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    .group-inputs {
      width: 100%;
      display: flex;
      align-items: center;
      gap: .5rem;
    }

    .group-inputs .p-inputtext,
    .group-inputs textarea {
      width: 100%;
      resize: none;
    }

    p-button {
      width: min-content;
    }
  `]
})
export class DataDialog implements OnInit {

  public data: any;
  public dataRaw = '';           // tampon texte pour le JSON
  public jsonError: string | null = null;
  public loaded = false;

  private api: ApiService = inject(ApiService);

  constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }

  ngOnInit(): void {
    const id = this.cfg?.data?.object_id;
    if (!id) {
      this.data = { name: '', data: {} };
      this.dataRaw = this.jsonify(this.data.data);
      this.loaded = true;
      return;
    }

    this.api.get(`models/data/${id}`).subscribe({
      next: (res: any) => {
        this.data = res ?? { name: '', data: {} };
        this.dataRaw = this.jsonify(this.data.data);
        this.validateJson();
        this.loaded = true;
      },
      error: () => {
        // fallback minimal en cas d'erreur d’API
        this.data = { name: '', data: {} };
        this.dataRaw = this.jsonify(this.data.data);
        this.loaded = true;
      }
    });
  }

  // Sérialise joliment (évite l’appel dans ngModel)
  public jsonify(obj: any) {
    try {
      return JSON.stringify(obj ?? {}, null, 2);
    } catch {
      return '{}';
    }
  }

  // Valide en continu le JSON saisi (à appeler si besoin sur (ngModelChange))
  public validateJson(): void {
    try {
      JSON.parse(this.dataRaw || '{}');
      this.jsonError = null;
    } catch (e: any) {
      this.jsonError = 'JSON invalide : ' + (e?.message ?? '');
    }
  }

  public onConfirm(): void {
    // Dernière validation avant fermeture
    this.validateJson();
    if (this.jsonError) return;

    try {
      const parsed = this.dataRaw ? JSON.parse(this.dataRaw) : {};
      this.data = { ...this.data, data: parsed };
      this.ref.close(this.data);
    } catch (e: any) {
      this.jsonError = 'JSON invalide : ' + (e?.message ?? '');
    }
  }
}
