import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-model-form',
  imports: [CommonModule, FormsModule, InputTextModule, DividerModule, KeyFilterModule],
  templateUrl: './model-form.html',
  styleUrls: [ './model-form.scss', './../form-wrapper.scss' ]
})
export class ModelForm {
  @Input() model: any;

  referenceRegex: RegExp = /^[a-z-]+$/;
}