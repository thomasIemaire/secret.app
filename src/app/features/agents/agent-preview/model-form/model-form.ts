import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Mapper } from "./mapper/mapper";
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-model-form',
  imports: [CommonModule, FormsModule, InputTextModule, Mapper, DividerModule],
  templateUrl: './model-form.html',
  styleUrls: ['./model-form.scss']
})
export class ModelForm {
  @Input() model: any;
}