import { Component, inject } from '@angular/core';
import { ModelForm } from "./model-form/model-form";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Breadcrumb } from "primeng/breadcrumb";
import { AppService } from '../../../core/services/app.service';

@Component({
  selector: 'app-agent-preview',
  imports: [ModelForm, CommonModule, ButtonModule, Breadcrumb],
  templateUrl: './agent-preview.html',
  styleUrls: ['./agent-preview.scss' ]
})
export class AgentPreview {

  public app = inject(AppService);
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);

  model: any = null;

  breadcrumb = [
    { label: 'Retour', url: '/agents' },
    { label: 'Modèle' },
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const modelId = params['id'];
      this.api.get(`models/${modelId}`).subscribe((data: any) => {
        this.model = {
          ...data,
          mapper: data.mapper ?? {},
          randomizers: data.randomizers ?? [],
          configuration: data.configuration ?? { attributes: [], formats: [], randomizers: [] }
        };
      });
    });
  }

  public saveModel() {
    const config = this.model.configuration;
    const config$ = config?._id
      ? this.api.put(`models/configurations/${config._id}`, config)
      : this.api.post('models/configurations/', config);

    config$.subscribe((savedCfg: any) => {
      this.model.configuration = savedCfg;
      this.api.put(`models/${this.model._id}`, this.model).subscribe((data: any) => {
        this.model = {
          ...data,
          mapper: data.mapper ?? {},
          randomizers: data.randomizers ?? [],
          configuration: data.configuration ?? savedCfg
        };
        this.api.get('models/').subscribe((models: any) => {
          this.app.models = models;
        });
      });
    });
  }

  public cancel() {
    this.router.navigate(['/agents']);
  }
}
