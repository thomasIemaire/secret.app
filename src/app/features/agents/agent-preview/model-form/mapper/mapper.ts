import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoFocusModule } from 'primeng/autofocus';
import { TooltipModule } from 'primeng/tooltip';

class Node {
  constructor(public parent: Node | null, public label: string = '', public children: Node[] = []) { }

  get key(): string {
    return (`${(this.parent?.key ?? 'root')}_${this.label}`).toUpperCase();
  }
}

type JsonObj = Record<string, unknown>;

function isPlainObject(v: unknown): v is JsonObj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function buildJson(nodes: Node[]): JsonObj {
  return nodes.reduce<JsonObj>((acc, node) => {
    const key = (node.label ?? '').trim();
    if (!key) return acc;

    const children = node.children ?? [];
    const value: unknown = children.length ? buildJson(children) : node.key;

    if (key in acc && isPlainObject(acc[key]) && isPlainObject(value)) {
      acc[key] = { ...(acc[key] as JsonObj), ...(value as JsonObj) };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

@Component({
  selector: 'app-mapper',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, AutoFocusModule, TooltipModule],
  templateUrl: './mapper.html',
  styleUrl: './mapper.scss'
})
export class Mapper {
  @Input() mapper: Node[] = [new Node(null)];

  @Input() json?: any;

  @Input() isRoot: boolean = false;

  @Output() jsonChange = new EventEmitter<Record<string, unknown>>();

  ngOnInit() {
    this.reloadJson();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['json']) this.reloadJson();
  }

  private reloadJson() {
    if (this.json) {
      if (Object.keys(this.json).length)
        this.mapper = this.buildMapper(this.json);
      else if (this.isRoot)
        this.mapper = [new Node(null)];
    }
  }

  private buildMapper(
    obj: Record<string, unknown>,
    parent: Node | null = null
  ): Node[] {
    return Object.entries(obj).map(([key, value]) => {
      const node = new Node(parent, key);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        node.children = this.buildMapper(value as Record<string, unknown>, node);
      }
      return node;
    });
  }

  public addNode(parent: Node | null): void {
    this.mapper.push(new Node(parent));
  }

  public addChild(node: Node): void {
    (node.children ??= []).push(new Node(node));
  }

  public removeNodeIfEmpty(node: Node): void {
    if ((node.label ?? '').trim() === '' && !(this.isRoot && this.isFirstNode(node))) {
      const i = this.mapper.indexOf(node);
      if (i > -1) this.mapper.splice(i, 1);
      this.emitJson();
    }
  }

  public isLastNode(node: Node): boolean {
    return node === this.mapper[this.mapper.length - 1];
  }

  public isFirstNode(node: Node): boolean {
    return node === this.mapper[0];
  }

  public emitJson(): void {
    this.jsonChange.emit(buildJson(this.mapper));
  }

  public onChildJsonChange(): void {
    this.emitJson();
  }

  public trackByIndex = (_: number, __: Node) => _;
}