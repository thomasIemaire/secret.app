import { Component, inject } from '@angular/core';
import { ModelForm } from "./model-form/model-form";
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Breadcrumb } from "primeng/breadcrumb";
import { AppService } from '../../../core/services/app.service';
import { ModelService } from '../../../core/services/model.service';

@Component({
  selector: 'app-agent-preview',
  imports: [ModelForm, CommonModule, ButtonModule, Breadcrumb],
  templateUrl: './agent-preview.html',
  styleUrls: ['./agent-preview.scss' ]
})
export class AgentPreview {

  public modelService: ModelService = inject(ModelService);

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
      this.modelService.getModel(modelId);
    });
  }

  public saveModel() {
    this.modelService.saveModel();
  }

  public cancel() {
    this.router.navigate(['/agents']);
  }
}
