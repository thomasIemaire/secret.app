import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../core/services/user.service';
import { AvatarModule } from 'primeng/avatar';
import { ApiService } from '../../../../core/services/api.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule, DynamicDialogModule, AvatarModule, TooltipModule],
  template: `
    <div>
      <div class="dialog-content">
        <div class="form__wrapper">
          <div class="group-inputs">
            <p-avatar 
              [image]="api.publicUrl + '/avatars/' + (userService.user?._id ?? '') + '.png'" 
              shape="circle"
              size="large" />
            <p-button size="small" text severity="secondary" icon="pi pi-refresh" (click)="refreshAvatar()"
             pTooltip="Changer d'image de profil"></p-button>
          </div>
          <div class="group-inputs">
            <span class="fullname">{{ userService.user?.firstname }} {{ userService.user?.lastname }}</span>
          </div>
          <div class="group-inputs">
            <span class="email">{{ userService.user?.email }}</span>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <p-button size="small" severity="secondary" label="Fermer" (click)="ref.close(true)"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .form__wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;

        .group-inputs {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: .5rem;

            .p-inputtext {
                width: 100%;
            }
        }

        p-button {
            width: min-content;
        }
    }

    .fullname {
        font-weight: 600;
    }

    .email {
        color: var(--p-text-muted-color);
        font-size: .875rem;
    }
    `]
})
export class UserDialogComponent {
  public userService: UserService = inject(UserService);
  public api: ApiService = inject(ApiService);

  constructor(public ref: DynamicDialogRef, public cfg: DynamicDialogConfig) { }

  public refreshAvatar(): void {
    this.api.put('users/me/avatar', {}).subscribe({});
  }
}
