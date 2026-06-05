import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ChartComponent } from '../chart-component/chart-component';
import { Fileupload } from '../fileupload/fileupload';
import { WebsocketService } from '../service/websocket';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartComponent, Fileupload, FormsModule],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.css',
})
export class Home {
  constructor(public ws: WebsocketService) {}

  ngOnInit() {
    this.ws.connect();
  }
  send() {
    this.ws.sendMessage('Hello Server');
  }
}
