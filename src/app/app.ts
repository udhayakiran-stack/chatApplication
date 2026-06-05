import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WebsocketService } from './service/websocket';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(public ws: WebsocketService) {}

  ngOnInit(): void {
    this.ws.connect();
  }

  send(): void {
    this.ws.sendMessage('Hello Server');
  }
}
