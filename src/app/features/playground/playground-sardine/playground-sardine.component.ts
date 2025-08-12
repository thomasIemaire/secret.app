import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Button } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-playground-sardine',
    imports: [CommonModule, FormsModule, RouterLink, SelectModule, Button],
    templateUrl: './playground-sardine.component.html',
    styleUrls: ['./playground-sardine.component.scss']
})
export class PlaygroundSardineComponent {

    public router: Router = inject(Router);

    public step: number = 0;

    public versions: string[] = [
        'latest',
        '1.0',
        '2.0',
        '3.0',
    ];

    public data: any = {
        version: this.versions[0],
        base64: '',
    };

    ngOnInit() {
        if (this.router.url !== '/playground/sardine') {

            const urlParts = this.router.url.split('/');
            const versionIndex = urlParts.indexOf('sardine') + 1;
            if (versionIndex < urlParts.length) {
                this.data.version = urlParts[versionIndex];
            }

            const queryParams = this.router.parseUrl(this.router.url).queryParams;
            if (queryParams['base64']) {
                this.data.base64 = queryParams['base64'];
            }

            if (!this.data.base64 || !this.data.version) {
                this.data = {
                    version: this.versions[0],
                    base64: '',
                };
                this.router.navigate(['/playground/sardine']);
            }

        }
    }

    public sendTest() {
        this.step++;
        this.router.navigate([`playground/sardine/${this.data.version}`], { queryParams: { base64: this.data.base64 } });
    }

    public filename: string = '';

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.readFile(input.files[0]);
        }
    }

    onDropFile(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files.length) {
            this.readFile(event.dataTransfer.files[0]);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    private readFile(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.data.base64 = (e.target as FileReader).result as string;
            this.filename = file.name;
        };
        reader.readAsDataURL(file);
    }
}
