import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    ViewChild,
    OnInit,
    AfterViewInit,
    OnDestroy,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PdfViewerModule } from 'ng2-pdf-viewer';

type DataState = { version: string; base64: string };

@Component({
    selector: 'app-playground-sardine',
    imports: [CommonModule, FormsModule, RouterLink, SelectModule, Button, PdfViewerModule],
    templateUrl: './playground-sardine.component.html',
    styleUrls: ['./playground-sardine.component.scss'],
    standalone: true,
})
export class PlaygroundSardineComponent implements OnInit, AfterViewInit, OnDestroy {
    public router: Router = inject(Router);

    @ViewChild('image') image!: ElementRef<HTMLCanvasElement>;
    
    public step = 0;

    public versions: string[] = ['latest', '1.0', '2.0', '3.0'];

    public data$ = new BehaviorSubject<DataState>({
        version: this.versions[0],
        base64: '',
    });

    public filename = '';

    private destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.data$
            .pipe(takeUntil(this.destroy$))
            .subscribe(state => { 
                this.renderImage(state.base64);
            });

        const current = this.data$.value;
        let nextState: DataState = { ...current };

        const urlParts = this.router.url.split('/');
        const versionIndex = urlParts.indexOf('sardine') + 1;
        if (versionIndex > 0 && versionIndex < urlParts.length) {
            nextState.version = urlParts[versionIndex] || current.version;
        }

        const queryParams = this.router.parseUrl(this.router.url).queryParams;
        if (queryParams['file']) {
            nextState.base64 = queryParams['file'];
        }

        if (this.router.url !== '/playground/sardine' && (!nextState.version || !nextState.base64)) {
            this.router.navigate(['/playground/sardine']);
        } else {
            this.data$.next(nextState);
        }
    }

    ngAfterViewInit(): void {
        this.renderImage(this.data$.value.base64);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onVersionChange(version: string) {
        this.data$.next({ ...this.data$.value, version });
    }

    public sendTest(): void {
        const { version, base64 } = this.data$.value;

        this.router.navigate([`playground/sardine/${version}`]);

        setTimeout(() => {
            this.renderImage(base64);
        }, 10);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.readFile(input.files[0]);
        }
    }

    onDropFile(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer?.files.length) {
            this.readFile(event.dataTransfer.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    private readFile(file: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target as FileReader).result as string;
            this.filename = file.name;
            this.data$.next({ ...this.data$.value, base64 });
        };
        reader.readAsDataURL(file);
    }

    public fileIsPDF(): boolean {
        const base64 = this.data$.value.base64;
        return base64.startsWith('data:application/pdf;') || base64.startsWith('data:application/x-pdf;');
    }

    private async renderImage(base64?: string): Promise<void> {
        if (!this.image?.nativeElement || !base64) return;

        const canvas = this.image.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.style.width = `${img.width}px`;
            canvas.style.height = `${img.height}px`;
            canvas.width = Math.floor(img.width * dpr);
            canvas.height = Math.floor(img.height * dpr);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = base64;
    }
}
