import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-chat-editor-component',
  standalone: true,
  imports: [QuillEditorComponent, FormsModule],
  templateUrl: './chat-editor-component.html',
  styleUrl: './chat-editor-component.css',
})
export class ChatEditorComponent {

  @Output()
  sendMessage = new EventEmitter<string>();

  message = '';

  quill!: Quill;

modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],

    [{ color: [] }, { background: [] }],
    [{ header: 1 }, { header: 2 }, { header: 3 }, { header: false }],
    [{ list: 'ordered' }, { list: 'bullet' }],

    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],

    ['link'],
    ['clean']
  ]
};

  // ✅ correct type from ngx-quill
  onEditorCreated(quill: Quill) {
    this.quill = quill;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

send(): void {

  let html = this.quill.root.innerHTML;

  if (!html || html === '<p><br></p>') return;

  html = html
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '<br>');

  this.sendMessage.emit(html);

  this.quill.setText('');
  this.message = '';
}

  onFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text = e.target.result as string;

      const chunks = this.chunkText(text, 300);
      this.message = chunks[0];
      this.quill?.setText(this.message)
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