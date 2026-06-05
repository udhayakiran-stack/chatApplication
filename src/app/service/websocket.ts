import { Injectable, signal} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    message = signal('');

   socket!: WebSocket;
     private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();
  connect() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onopen = () => {
      console.log('Connected');
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.message) {
          try {
            const parsed = JSON.parse(data.message);
            if (parsed?.from === 'user_details' || parsed?.from == 'messages') {
              this.messageSubject.next(parsed);
            }
            else {
              this.message.set(parsed);
            }
          } catch {

          }
        }
   
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('Disconnected');
    };
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  disconnect() {
    this.socket.close();
  }
}