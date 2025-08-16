import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-json-viewer',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bd viewer">
        <div class="tree" role="tree" aria-label="JSON">
            <ng-container *ngIf="json !== undefined; else empty">
            <!-- on rend directement le 1er étage de json -->
            <ng-container [ngSwitch]="valueType(json)">

                <!-- JSON objet : chaque clé du 1er niveau -->
                <ng-container *ngSwitchCase="'object'">
                <ng-container *ngFor="let kv of objectEntries(json); trackBy: trackByKey">
                    <ng-container
                    *ngTemplateOutlet="node; context: { key: kv.key, value: kv.value, depth: 0 }">
                    </ng-container>
                </ng-container>
                </ng-container>

                <!-- JSON tableau : chaque index du 1er niveau -->
                <ng-container *ngSwitchCase="'array'">
                <ng-container *ngFor="let v of json; let i = index; trackBy: trackByIndex">
                    <ng-container
                    *ngTemplateOutlet="node; context: { key: i, value: v, depth: 0 }">
                    </ng-container>
                </ng-container>
                </ng-container>

                <!-- Primitive au 1er niveau -->
                <div *ngSwitchDefault class="kv-row">
                <span class="val" [ngClass]="valueType(json)">{{ displayValue(json) }}</span>
                </div>

            </ng-container>
            </ng-container>

            <ng-template #empty>
            <div class="muted small">Aucun JSON fourni.</div>
            </ng-template>
        </div>
    </div>

    <!-- rendu récursif (inchangé) -->
    <ng-template #node let-key="key" let-value="value" let-depth="depth">
    <ng-container [ngSwitch]="valueType(value)">

        <!-- Objet -->
        <details *ngSwitchCase="'object'" [class.first]="depth < 1" [attr.open]="depth < 1 ? '' : null">
        <summary>
            <span class="key">{{ key }}</span>
            <span class="badge">Object ({{ countItems(value) }})</span>
        </summary>

        <ng-container *ngFor="let kv of objectEntries(value); trackBy: trackByKey">
            <ng-container
            *ngTemplateOutlet="node; context: { key: kv.key, value: kv.value, depth: depth + 1 }">
            </ng-container>
        </ng-container>
        </details>

        <!-- Tableau -->
        <details *ngSwitchCase="'array'" [class.first]="depth < 1" [attr.open]="depth < 1 ? '' : null">
        <summary>
            <span class="key">{{ key }}</span>
            <span class="badge">Array ({{ value.length }})</span>
        </summary>

        <ng-container *ngFor="let v of value; let i = index; trackBy: trackByIndex">
            <ng-container
            *ngTemplateOutlet="node; context: { key: i, value: v, depth: depth + 1 }">
            </ng-container>
        </ng-container>
        </details>

        <!-- Valeur primitive -->
        <div *ngSwitchDefault class="kv-row">
        <span class="key">{{ key }}</span>
        <span class="sep">:</span>
        <span class="val" [ngClass]="valueType(value)">{{ displayValue(value) }}</span>
        </div>

    </ng-container>
    </ng-template>
    `,
    styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent {
    @Input()
    public json!: any;

    valueType(v: any): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'undefined' {
        if (v === null) return 'null';
        if (Array.isArray(v)) return 'array';
        const t = typeof v;
        return t === 'object' ? 'object' : (t as any);
    }

    countItems(v: any): number {
        if (Array.isArray(v)) return v.length;
        if (v && typeof v === 'object') return Object.keys(v).length;
        return 0;
    }

    displayValue(v: any): string {
        if (v === null) return 'null';
        if (typeof v === 'string') return `"${v}"`;
        return String(v);
    }

    objectEntries(o: Record<string, any>): Array<{ key: string; value: any }> {
        const keys = Object.keys(o || {});
        return keys.map(key => ({ key, value: (o as any)[key] }));
    }

    trackByKey = (_: number, kv: { key: string }) => kv.key;
    trackByIndex = (i: number) => i;
}
