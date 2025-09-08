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

  public model: any = {};

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
        }
      });
    });
  }

  public saveModel() {
    this.api.put(`models/${this.model._id}`, this.model).subscribe({
      next: () => {
        this.router.navigate(['/agents']);
        this.app.models.push(this.model);
      }
    });
  }

  public cancel() {
    this.router.navigate(['/agents']);
  }
}
