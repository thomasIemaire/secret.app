import { Component, inject } from '@angular/core';
import { ModelForm } from "./model-form/model-form";
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agent-preview',
  imports: [ModelForm],
  templateUrl: './agent-preview.html',
  styleUrl: './agent-preview.scss'
})
export class AgentPreview {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private api = inject(ApiService);

  model: Observable<any> | any = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const modelId = params['id'];
      this.api.get(`models/${modelId}`).subscribe((data: any) => {
        this.model = data;
      });
    });
  }
}
