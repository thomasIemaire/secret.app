import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { AutoFocusModule } from 'primeng/autofocus';

type FormatObj = { format: string };
type Token = { text: string; key?: string };

@Component({
  selector: 'app-formats-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputText, Button, AutoFocusModule, TooltipModule],
  templateUrl: './formats-form.html',
  styleUrls: ['./formats-form.scss', './../../../form-wrapper.scss'],
})
export class FormatsForm {
  public edit: number = -1;

  private _items: FormatObj[] = [];

  @Output() formatsChange = new EventEmitter<string[]>();

  @Input() set formats(value: string[] | FormatObj[] | null | undefined) {
    const arr = Array.isArray(value) ? value : [];
    this._items = arr.map(v =>
      (typeof v === 'string') ? { format: v }
        : (v && typeof v === 'object' && 'format' in v) ? (v as FormatObj)
          : { format: String(v ?? '') }
    );
  }
  get formats(): FormatObj[] {
    return this._items;
  }

  addFormat() {
    this._items = [...this._items, { format: '' }];
    this.emit();
  }

  removeFormat(index: number) {
    this._items = this._items.filter((_, i) => i !== index);
    this.emit();
  }

  onItemChange() {
    this.emit();
  }

  private emit() {
    this.formatsChange.emit(this._items.map(i => i.format));
  }

  /** ---------- Affichage tokenisé des formats ---------- */

  /** Convertit une chaîne avec {CLE} en tokens (texte + placeholders) */
  tokensOf(format: string): Token[] {
    if (!format) return [];
    const out: Token[] = [];
    const re = /\{([^{}]+)\}/g; // {KEY} sans imbrication
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(format)) !== null) {
      const start = m.index;
      const end = re.lastIndex;
      if (start > lastIdx) out.push({ text: format.slice(lastIdx, start) });

      const key = m[1].trim();
      out.push({ text: this.keyToLabel(key), key });
      lastIdx = end;
    }

    if (lastIdx < format.length) {
      out.push({ text: format.slice(lastIdx) });
    }
    return out;
  }

  /**
   * Transforme la clé en libellé affichable.
   * Ex: "HELLO_HELLO_NOM" -> "nom"
   * Règle simple: on prend le dernier segment (séparateur _ ou espace) et on le met en minuscule.
   * Tu peux ajuster selon tes conventions (capitalisation, mapping, etc.).
   */
  private keyToLabel(key: string): string {
    const parts = key.split(/[_\s]+/).filter(Boolean);
    const last = parts[parts.length - 1] ?? key;
    return last.toLowerCase();
  }
}
