import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AttributesForm } from "./attributes-form/attributes-form";
import { FormatsForm } from "./formats-form/formats-form";
import { ApiService } from '../../../../../core/services/api.service';
import { AppService } from '../../../../../core/services/app.service';
import { ModelService } from '../../../../../core/services/model.service';

@Component({
  selector: 'app-configuration-form',
  imports: [CommonModule, FormsModule, InputTextModule, AttributesForm, FormatsForm],
  templateUrl: './configuration-form.html',
  styleUrls: ['./configuration-form.scss', './../../form-wrapper.scss'],
  standalone: true,
})
export class ConfigurationForm {
  @Input() id: string | undefined = undefined;

  public modelService: ModelService = inject(ModelService);

  private api: ApiService = inject(ApiService);
  private app: AppService = inject(AppService);

  public configuration: any;

  ngOnInit() {
    this.refreshConfiguration();

    this.api.get('models/configurations/').subscribe((data: any) => {
      this.app.configurations = data;
    });
    this.api.get('models/data/').subscribe((data: any) => {
      this.app.data = data;
    });
  }

  ngOnChanges() {
    this.refreshConfiguration();
  }

  private refreshConfiguration() {
    this.modelService.getConfiguration();
  }
}