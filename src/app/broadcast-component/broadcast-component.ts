import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadCastService } from '../service/broad-cast-service';
@Component({
  selector: 'app-broadcast-component',
  imports: [],
  templateUrl: './broadcast-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './broadcast-component.css',
})
export class BroadcastComponent implements OnInit {
  channelName = '';
  channel!: BroadcastChannel;
  constructor(
    private route: ActivatedRoute,
    private broadcast: BroadCastService,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.channelName = params['value'] || 'default-channel';
      this.broadcast.initialize(this.channelName);
      // this.channel = new BroadcastChannel(this.channelName);
      // this.channel.onmessage = (event) => {
      //   console.log('Received:', event.data);
      // };
    });

    this.broadcast.messages$.subscribe((data) => {
      console.log('Received:', data);
    });
  }
  sendMessage() {
    this.broadcast.send({
      text: `Hello from ${this.channelName}`,
    });
  }
  ngOnDestroy() {
    this.broadcast.close();
  }
}
