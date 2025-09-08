import { Component, inject } from '@angular/core';
import { ModelForm } from "./model-form/model-form";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Breadcrumb } from "primeng/breadcrumb";
import { AppService } from '../../../core/services/app.service';
import { DividerModule } from 'primeng/divider';
import { ConfigurationForm } from "./configuration-form/configuration-form";
import { Mapper } from './model-form/mapper/mapper';

@Component({
  selector: 'app-agent-preview',
  imports: [ModelForm, CommonModule, ButtonModule, Breadcrumb, ConfigurationForm, DividerModule, Mapper],
  templateUrl: './agent-preview.html',
  styleUrls: ['./agent-preview.scss']
})
export class AgentPreview {

  public model: any = {};
  public keys: string[] = [];
  public configuration: any = {};

  public app = inject(AppService);
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);

  breadcrumb = [
    { label: 'Retour', url: '/agents' },
    { label: 'Modèle' },
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const modelId = params['id'];
      this.api.get(`models/${modelId}`).subscribe({
        next: (model) => {
          this.model = model;

          this.api.get(`models/configurations/${this.model.configuration}`).subscribe((data: any) => {
            this.configuration = data;
          }, error => {
            this.configuration = {
              name: '',
              description: '',
              attributes: [],
              formats: []
            };
          });
        }
      });
    });
  }

  public updateKeys(keys: string[]) {
    this.keys = keys;
  }

  public saveModel() {
    this.api.put(`models/${this.model._id}`, this.model).subscribe({
      next: () => {
        this.api.put(`models/configurations/${this.configuration._id}`, this.configuration).subscribe({
          next: () => {
            this.router.navigate(['/agents']);
          }
        });
      }
    });
  }

  public cancel() {
    this.router.navigate(['/agents']);
  }
}
