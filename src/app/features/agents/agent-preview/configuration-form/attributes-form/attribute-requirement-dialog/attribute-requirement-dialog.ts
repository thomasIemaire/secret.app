import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputText } from "primeng/inputtext";
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DynamicDialogModule, InputText, Select],
  template: `
    <div>
      <div class="form__wrapper">
        <div class="group-inputs">
          <p-select size="small" [(ngModel)]="cfg.data.requirement.rule" optionLabel="label" optionValue="value" placeholder="Règle" [options]="RuleOptions" appendTo="body"/>
          <input pInputText pSize="small" [(ngModel)]="cfg.data.requirement.constraint" placeholder="Constrainte" />
        </div>
      </div>

      <div class="dialog-footer">
        <p-button size="small" variant="text" severity="secondary" label="Annuler" (click)="ref.close(false)"></p-button>
        <p-button size="small" severity="secondary" label="Confirmer" (click)="ref.close(cfg.data.requirement)"></p-button>
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

    .form__wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: .5rem;

        .group-inputs {
            width: 100%;
            display: flex;
            align-items: center;
            gap: .5rem;

            .p-inputtext {
                width: 100%;
            }
        }

        p-button {
            width: min-content;
        }
    }
    `]
})
export class AttributeRequirementDialog {
  constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }

  RuleOptions = [
    { label: 'Regex', value: 'regex' },
    { label: 'Greater than', value: 'gt' },
    { label: 'Greater than or equal', value: 'gte' },
    { label: 'Less than', value: 'lt' },
    { label: 'Less than or equal', value: 'lte' },
    { label: 'Equal', value: 'eq' },
    { label: 'Not equal', value: 'neq' },
    { label: 'In', value: 'in' },
    { label: 'Not in', value: 'nin' },
  ]
}
