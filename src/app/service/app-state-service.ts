import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  showEmailPopup = true
  user_details!: userDetails
  activeUserEmail: string = ''
  receiveMessage(data: any){
    this.user_details = data
  }
}
export interface userDetails{
  name: string,
  email: string
}