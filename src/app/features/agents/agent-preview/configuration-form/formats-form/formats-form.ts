import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
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
  styleUrls: ['./formats-form.scss', './../../form-wrapper.scss'],
})
export class FormatsForm implements OnChanges {
  public edit = -1;

  private _items: FormatObj[] = [];
  public tokens: Token[][] = [];

  @Output() formatsChange = new EventEmitter<string[]>();

  @Input() keys: any[] = []; // quand ceci change, il faut regénérer les tokens

  @Input() set formats(value: string[] | FormatObj[] | null | undefined) {
    const arr = Array.isArray(value) ? value : [];
    this._items = arr.map(v =>
      (typeof v === 'string') ? { format: v }
        : (v && typeof v === 'object' && 'format' in v) ? (v as FormatObj)
          : { format: String(v ?? '') }
    );
    // Recalcule immédiat quand formats est assigné
    this.recomputeAllTokens();
  }

  get formats(): FormatObj[] {
    return this._items;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['keys'] && !changes['keys'].firstChange) {
      // si les labels ont changé, on régénère
      this.recomputeAllTokens();
    }
  }

  private recomputeAllTokens() {
    this.tokens = this._items.map(it => this.tokensOf(it.format));
  }

  private recomputeOneToken(index: number) {
    this.tokens[index] = this.tokensOf(this._items[index]?.format ?? '');
  }

  addFormat() {
    this._items = [...this._items, { format: '' }];
    this.tokens = [...this.tokens, []]; // garder les tableaux alignés
    this.emit();
  }

  removeFormat(index: number) {
    this._items = this._items.filter((_, i) => i !== index);
    this.tokens = this.tokens.filter((_, i) => i !== index);
    this.emit();
  }

  // Passez l’index depuis le template pour recalculer les tokens de la ligne éditée
  onItemChange(index: number) {
    this.recomputeOneToken(index);
    this.emit();
  }

  private emit() {
    this.formatsChange.emit(this._items.map(i => i.format));
  }

  tokensOf(format: string): Token[] {
    if (!format) return [];
    const out: Token[] = [];
    const re = /\{([^{}]+)\}/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(format)) !== null) {
      const start = m.index;
      const end = re.lastIndex;
      if (start > lastIdx) out.push({ text: format.slice(lastIdx, start) });

      const key = m[1].trim();
      const value = this.keys.find(k => k.value === key)?.label || key;
      out.push({ text: this.keyToLabel(value), key });
      lastIdx = end;
    }

    if (lastIdx < format.length) {
      out.push({ text: format.slice(lastIdx) });
    }
    return out;
  }

  private keyToLabel(key: string): string {
    const parts = key.split(/[_\s]+/).filter(Boolean);
    const last = parts[parts.length - 1] ?? key;
    return last.toLowerCase();
  }
}