import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AutoFocusModule } from 'primeng/autofocus';

class Node {
  constructor(public label: string = '', public children: Node[] = []) { }
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
    const value: unknown = children.length ? buildJson(children) : '';

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
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, AutoFocusModule],
  templateUrl: './mapper.html',
  styleUrl: './mapper.scss'
})
export class Mapper {
  @Input() mapper: Node[] = [
    new Node('', [])
  ];

  @Input() json?: any;

  @Input() isRoot: boolean = false;

  @Output() jsonChange = new EventEmitter<Record<string, unknown>>();

  ngOnInit() {
    console.log(this.json);
    

    if (this.json && Object.keys(this.json).length) {
      this.mapper = this.buildMapper(this.json);
    }
  }

  private buildMapper(obj: Record<string, unknown>): Node[] {
    return Object.entries(obj).map(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return new Node(key, this.buildMapper(value as Record<string, unknown>));
      } else {
        return new Node(key, []);
      }
    });
  }

  public addNode(): void {
    this.mapper.push(new Node(''));
    this.emitJson();
  }

  public addChild(node: Node): void {
    (node.children ??= []).push(new Node(''));
    this.emitJson();
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