import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Chat } from './chat/chat';
import { BroadcastComponent } from './broadcast-component/broadcast-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'chat', component: Chat },
{ path: 'broadcast', component: BroadcastComponent },
];