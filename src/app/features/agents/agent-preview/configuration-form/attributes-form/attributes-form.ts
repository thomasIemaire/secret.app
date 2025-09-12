import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AttributeRequirementDialog } from './attribute-requirement-dialog/attribute-requirement-dialog';
import { ApiService } from '../../../../../core/services/api.service';
import { DataDialog } from './data-dialog/data-dialog';
import { ConfigurationForm } from '../configuration-form';
import { AppService } from '../../../../../core/services/app.service';

@Component({
  selector: 'app-attributes-form',
  imports: [CommonModule, FormsModule, InputText, Select, Button, TooltipModule, MultiSelectModule],
  templateUrl: './attributes-form.html',
  styleUrls: ['./attributes-form.scss', './../../form-wrapper.scss'],
  providers: [DialogService],
  standalone: true,
})
export class AttributesForm {
  @Input() attributes: any[] = [];
  @Input() keys: any[] = [];

  private dialogService: DialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  private api: ApiService = inject(ApiService);
  public app: AppService = inject(AppService);

  public typeOptions = [
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
  ]

  public ruleOptions = [
    { label: 'Configuration', value: 'configuration' },
    { label: 'Data', value: 'data' },
    { label: 'Randint', value: 'randint' },
    { label: 'Alphanumérique', value: 'alphanum' },
  ]

  public addAttribute() {
    this.attributes.push({
      key: '',
      frequency: 1,
      value: {
        type: 'string',
        rule: 'data',
        parameters: {}
      },
      requirements: []
    });
  }

  public removeAttribute(i: number) {
    this.attributes.splice(i, 1);
  }

  public openRequirementDialog(attribute: any, requirement: any = { rule: '', constraint: '' }, method: 'add' | 'edit' = 'add') {
    this.ref = this.dialogService.open(AttributeRequirementDialog, {
      header: "Requirement",
      width: '400px',
      contentStyle: { overflow: 'auto' },
      modal: true,
      appendTo: 'body',
      data: { requirement }
    });

    this.ref.onClose.subscribe((requirementUpdated: any) => {
      if (requirementUpdated) {
        if (method === 'add')
          attribute.requirements = [...attribute.requirements, requirementUpdated];
        else
          Object.assign(requirement, requirementUpdated);
      }
    });
  }

  public openDataDialog(object_id: string, attribute: any, method: 'add' | 'edit' = 'add') {
    this.ref = this.dialogService.open(DataDialog, {
      header: "Données",
      width: '600px',
      contentStyle: { overflow: 'auto' },
      modal: true,
      appendTo: 'body',
      data: { object_id: method === 'edit' ? object_id : undefined },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        if (method === 'add') {
          this.api.post(`models/data/`, data).subscribe({
            next: (newData: any) => {
              this.app.data.push(newData);
              attribute.value.parameters.object_id = newData._id;
            }
          });
        } else {
          this.api.put(`models/data/${object_id}`, data).subscribe({
            next: (newData: any) => {
              this.app.data.push(newData);
              attribute.value.parameters.object_id = newData._id;
            }
          });
        }
      }
    });
  }

  public openConfigurationDialog(object_id: string, attribute: any, method: 'add' | 'edit' = 'add') {
    this.ref = this.dialogService.open(ConfigurationForm, {
      header: "Configuration",
      width: '70vw',
      contentStyle: { overflow: 'auto' },
      modal: true,
      appendTo: 'body',
      inputValues: { 
        id: method === 'edit' ? object_id : undefined,
        dialog: true
      }
    });

    this.ref.onClose.subscribe((configuration: any) => {
      if (configuration) {
        if (method === 'add') {
          this.api.post(`models/configurations/`, configuration).subscribe({
            next: (newConfiguration: any) => {
              this.app.configurations.push(newConfiguration);
              attribute.value.parameters.object_id = newConfiguration._id;
            }
          });
        } else {
          this.api.put(`models/configurations/${object_id}`, configuration).subscribe({
            next: (newConfiguration: any) => {
              this.app.configurations.push(newConfiguration);
              attribute.value.parameters.object_id = newConfiguration._id;
            }
          });
        }
      }
    });
  }

  public deleteConfiguration(id: string) {
    this.api.delete(`models/configurations/${id}`).subscribe({
      next: () => {
        this.app.configurations = this.app.configurations.filter(c => c._id !== id);
      }
    });
  }

  public deleteData(id: string) {
    this.api.delete(`models/data/${id}`).subscribe({
      next: () => {
        this.app.data = this.app.data.filter(d => d._id !== id);
      }
    });
  }
}