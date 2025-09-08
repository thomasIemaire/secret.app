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
import { ApiService } from '../../../../../../core/services/api.service';
import { DataDialog } from './data-dialog/data-dialog';
import { ConfigurationDialog } from './configuration-dialog/configuration-dialog';

@Component({
  selector: 'app-attributes-form',
  imports: [CommonModule, FormsModule, InputText, Select, Button, TooltipModule, MultiSelectModule],
  templateUrl: './attributes-form.html',
  styleUrls: ['./attributes-form.scss', './../../../form-wrapper.scss'],
  providers: [DialogService],
  standalone: true,
})
export class AttributesForm {
  @Input() attributes: any[] = [];

  private dialogService: DialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;
  private api: ApiService = inject(ApiService);

  public typeOptions = [
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
  ]

  public ruleOptions = [
    { label: 'Configuration', value: 'configuration' },
    { label: 'Data', value: 'data' },
    { label: 'Randint', value: 'randint' }
  ]

  public dataOptions = []

  public configurationOptions = []

  ngOnInit() {
    this.attributes.forEach(attribute => {
      attribute.requirements = attribute.requirements ?? [];
    });

    this.api.get('models/data/').subscribe((data: any) => {
      this.dataOptions = data.map((d: any) => ({ label: d.name, value: d._id }));
    });

    this.api.get('models/configurations/').subscribe((data: any) => {
      this.configurationOptions = data.map((d: any) => ({ label: d.name, value: d._id }));
    });
  }

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

  public removeAttribute(attribute: any) {
    this.attributes = this.attributes.filter(attr => attr !== attribute);
  }

  public openRequirementDialog(attribute: any, requirement: any = {}, method: 'add' | 'edit' = 'add') {
    if (method === 'add' && Object.keys(requirement).length === 0) {
      requirement = { rule: '', constraint: '' };
      attribute.requirements = [...attribute.requirements ?? [], requirement];
    }

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
        if (Object.keys(requirement).length === 0)
          attribute.requirements = [...attribute.requirements, requirementUpdated];
        else
          Object.assign(requirement, requirementUpdated);
      }
    });
  }

  public openDataDialog(object_id: string) {
    this.ref = this.dialogService.open(DataDialog, {
      header: "Données",
      width: '600px',
      contentStyle: { overflow: 'auto' },
      modal: true,
      appendTo: 'body',
      data: { object_id }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        // Handle the data returned from the dialog
      }
    });
  }

  public openConfigurationDialog(attribute: any) {
    const object_id = attribute.value.parameters.object_id;
    this.ref = this.dialogService.open(ConfigurationDialog, {
      header: "Configuration",
      width: '70vw',
      contentStyle: { overflow: 'auto' },
      modal: true,
      appendTo: 'body',
      data: { object_id }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data?._id) {
        attribute.value.parameters.object_id = data._id;
        const existing = this.configurationOptions.find((o: any) => o.value === data._id);
        if (existing) {
          existing.label = data.name;
        } else {
          this.configurationOptions = [...this.configurationOptions, { label: data.name, value: data._id }];
        }
      }
    });
  }
}
