import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-formats-form',
  imports: [CommonModule, FormsModule, InputText, Button, TooltipModule],
  templateUrl: './formats-form.html',
  styleUrls: ['./formats-form.scss', './../../../form-wrapper.scss'],
})
export class FormatsForm {
  @Input() formats: any[] = [];

  public addFormat() {
    this.formats.push('');
  }

  public removeFormat(index: number) {
    this.formats.splice(index, 1);
  }
}
