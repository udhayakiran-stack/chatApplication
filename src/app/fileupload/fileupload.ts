import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-fileupload',
  standalone: true,
  imports: [NgIf],
  templateUrl: './fileupload.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './fileupload.css',
})
export class Fileupload {
  uploadText: any = signal('');
  onFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text = e.target.result as string;

      const chunks = this.chunkText(text, 300);

      this.uploadText.set(chunks);
    };

    reader.readAsText(file);
  }

  chunkText(text: string, size: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < text.length; i += size) {
      result.push(text.substring(i, i + size));
    }

    return result;
  }
}
