import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-playground-sardine',
    imports: [CommonModule, FormsModule, RouterLink, SelectModule, Button],
    templateUrl: './playground-sardine.component.html',
    styleUrls: ['./playground-sardine.component.scss']
})
export class PlaygroundSardineComponent {

    public step: number = 0;

    public versions: string[] = [
        'Latest',
        '1.0',
        '2.0',
        '3.0',
    ];

    public data: any = {
        version: this.versions[0],
        base64: '',
    };

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
        };
        reader.readAsDataURL(file);
    }
}
