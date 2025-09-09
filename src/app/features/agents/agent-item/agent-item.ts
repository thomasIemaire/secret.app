import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ProgressBar } from 'primeng/progressbar';
import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'app-agent-item',
  imports: [CommonModule, FormsModule, AvatarModule, TagModule, ProgressBar, TieredMenu],
  templateUrl: './agent-item.html',
  styleUrl: './agent-item.scss'
})
export class AgentItem {
  @Input() type: 'model' | 'dataset' | 'agent' = 'dataset';
  @Input() agent: any;

  @Input() classes: string | string[] | Set<string> | { [klass: string]: any } = '';

  public api: ApiService = inject(ApiService);

  public items: MenuItem[] = [
    { label: 'Supprimer', icon: 'pi pi-trash', command: () => this.deleteAgent(this.agent._id) }
  ];

  public getProgress(progress: number) {
    if (!progress) return 0;
    return Math.min(100, Math.max(0, Math.round(progress * 100)));
  }

  public deleteAgent(id: string, type: string = this.type) {
    this.api.delete(`${type}s/${id}`).subscribe(() => { });
  }
}
