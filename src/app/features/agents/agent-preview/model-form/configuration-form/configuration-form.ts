import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AttributesForm } from "./attributes-form/attributes-form";
import { FormatsForm } from "./formats-form/formats-form";

@Component({
  selector: 'app-configuration-form',
  imports: [CommonModule, FormsModule, InputTextModule, AttributesForm, FormatsForm],
  templateUrl: './configuration-form.html',
  styleUrls: [ './configuration-form.scss', './../../form-wrapper.scss' ],
  standalone: true,
})
export class ConfigurationForm {
  @Input() configuration: any = {
    "_id": "68b85d3ec80e8b4d1207787d",
    "attributes": [
      {
        "frequency": 1,
        "key": "age",
        "requirements": [
          {
            "constraint": "^-?\\d+$",
            "rule": "regex"
          },
          {
            "constraint": 0,
            "rule": "gt"
          },
          {
            "constraint": 150,
            "rule": "lte"
          }
        ],
        "value": {
          "parameters": {
            "max": 500,
            "min": -500
          },
          "rule": "randint",
          "type": "number"
        }
      },
      {
        "frequency": 1,
        "key": "name",
        "value": {
          "parameters": {
            "object_id": "68b85d32c80e8b4d1207787c"
          },
          "rule": "data",
          "type": "string"
        }
      }
    ],
    "created_at": "Wed, 03 Sep 2025 15:22:38 GMT",
    "created_by": "68b85cf9c80e8b4d1207787a",
    "description": "",
    "formats": [
      "{name} a {age} ans",
      "Quel age as-tu {name} ? J'ai {age} ans",
      "{name} ne fait pas son age, il a {age} ans"
    ],
    "name": "Prénom et Age",
    "possibilities": 18000,
    "randomizers": []
  }
}
