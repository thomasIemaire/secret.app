import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AttributesForm } from "./attributes-form/attributes-form";
import { FormatsForm } from "./formats-form/formats-form";
import { ApiService } from '../../../../../core/services/api.service';
import { AppService } from '../../../../../core/services/app.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-configuration-form',
  imports: [CommonModule, FormsModule, InputTextModule, AttributesForm, FormatsForm, ButtonModule],
  templateUrl: './configuration-form.html',
  styleUrls: ['./configuration-form.scss', './../../form-wrapper.scss'],
  standalone: true,
})
export class ConfigurationForm {
  @Input() id: string | undefined = undefined;

  @Input() configuration: any = {
    name: '',
    description: '',
    attributes: [],
    formats: []
  };

  @Input() model: any;

  @Input() dialog: boolean = false;

  private api: ApiService = inject(ApiService);
  private app: AppService = inject(AppService);

  ngOnInit() {
    if (this.id) {
      this.refreshConfiguration();
    }

    this.api.get('models/configurations/').subscribe((data: any) => {
      this.app.configurations = data;
    });
    this.api.get('models/data/').subscribe((data: any) => {
      this.app.data = data;
    });
  }

  ngOnChanges() {
    if (this.id) {
      this.refreshConfiguration();
    }
  }

  public getKeysFromModel() {
    if (this.model) {
      return this.model.mapper
    }
  }

  private refreshConfiguration() {
    this.api.get(`models/configurations/${this.id}`).subscribe((data: any) => {
      this.configuration = data;
      this.id = data._id;
    }, error => {
      this.configuration = {
        name: '',
        description: '',
        attributes: [],
        formats: []
      };
    });
  }

  public saveConfiguration() {
    this.api.post(`models/configurations/`, this.configuration).subscribe({
      next: (newConfig: any) => {
        this.app.configurations.push(newConfig);
        this.configuration = newConfig;
        this.id = newConfig._id;
      }
    }); 
  }
}