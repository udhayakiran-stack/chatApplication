import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BroadCastService {
  private channel!: BroadcastChannel;
  messages$ = new Subject<any>();
  initialize(channelName: string) {
    if (this.channel) {
      this.channel.close();
    }
    this.channel = new BroadcastChannel(channelName);
    this.channel.onmessage = (event) => {
      this.messages$.next(event.data);
    };
  }
  send(data: any) {
    this.channel?.postMessage(data);
  }
  close() {
    this.channel?.close();
  }
}