import {
  Component,
  OnInit,
  ChangeDetectorRef,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { WebsocketService } from '../service/websocket';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AppStateService } from '../service/app-state-service';
import { AiService } from '../services/ai';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MarkdownModule } from 'ngx-markdown';
import { ChatEditorComponent } from '../chat-editor-component/chat-editor-component';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DragDropModule, MarkdownModule, ChatEditorComponent],
  templateUrl: './chat.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chat.css',
})
export class Chat implements OnInit {
  constructor(
    private ws: WebsocketService,
    private cdr: ChangeDetectorRef,
    public appState: AppStateService,
    private aiService: AiService,
  ) { }
  // showEmailPopup: boolean = true;
  message: any = '';
  isOpen = false;
  question = '';
  response = '';
  loading = false;
  copyMessage: string = 'Copy';
  messages: { from: string; text: string; to: string }[] = [];
  allMessages: { from: string; text: string; to: string }[] = [];
  activeUserEmail: string | null = null;
  email = '';
  name = '';
  allNotification: any[] = [];
  allUserDetail: any[] = [];
  user_details!: userDetails;
  ngOnInit(): void {
    this.ws.messages$.subscribe((data) => {
      if (data?.from === 'user_details') {
        this.allUserDetail = [...this.allUserDetail, data.data];
      } else if (data?.from === 'messages') {
        console.log(data);
        if (data.to == this.user_details.email && data?.data.from != this.activeUserEmail) {
          var notificationUsers = localStorage.getItem(`${this.user_details.email}`)
          this.allNotification = JSON.parse(notificationUsers || '[]')
          this.allNotification = this.allNotification.map((e: any) =>
            e.email === data?.data.from
              ? { ...e, count: e.count + 1 }
              : e
          );

          const exists = this.allNotification.some(
            (e: any) => e.email === data?.data.from
          );

          if (!exists) {
            this.allNotification.push({
              email: data?.data.from,
              count: 1
            });
          }
          localStorage.setItem(`${this.user_details.email}`,JSON.stringify(this.allNotification))
          this.mapToAllUsers()
        }
        var all_messages = localStorage.getItem('all_messages');
        if (all_messages) {
          this.allMessages = JSON.parse(all_messages);
        }
        this.messages = this.allMessages.filter((e) => {
          return (
            (e.from == this.activeUserEmail && e.to == this.user_details.email) ||
            (e.from == this.user_details.email && e.to == this.activeUserEmail)
          );
        });
        this.scrollView();
      }
      this.cdr.detectChanges();
    });
    this.user_details = this.appState.user_details;
    var all_user_details = localStorage.getItem('all_user_details');
    var all_messages = localStorage.getItem('all_messages');
    var allNotification = localStorage.getItem(`${this.user_details?.email}`);
    if (all_messages) {
      this.allMessages = JSON.parse(all_messages);
    }
    if (all_user_details) {
      this.allUserDetail = JSON.parse(all_user_details || '[]');
      if (!this.appState.activeUserEmail && this.allUserDetail.length) {
        // console.log(this.allUserDetail[0].email);
        // this.appState.activeUserEmail = this.allUserDetail[0]?.email;
      }
      if (this.appState.activeUserEmail) {
        this.setActive(this.appState.activeUserEmail);
      }
    }
    this.allNotification = JSON.parse(allNotification || '[]')
    this.mapToAllUsers()
  }
  ngAfterViewInit() { }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.response = '';
  }
  mapToAllUsers = ()=>{
    this.allUserDetail = this.allUserDetail.map((user: any) => {

  const notification = this.allNotification.find(
    (n: any) => n.email === user.email
  );
  return {
    ...user,
    count: notification ? notification.count : 0
  };
  
    });
    this.cdr.detectChanges()
  console.log(this.allUserDetail);

  }
  send(message: string): void {
    const payload = {
      content: message,
      timestamp: new Date()
    };
    this.message = message
    this.sendMessage()
    console.log(payload);
  }

  submit() {
    if (!this.question.trim()) return;
    this.loading = true;
    this.response = '';
    this.aiService.askAI(this.question).subscribe((res: any) => {
      this.question = '';
      this.response = res.choices[0].message.content;
      console.log(this.response);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  copyResponse() {
    navigator.clipboard.writeText(this.response).then(() => {
      this.copyMessage = 'Copied';
      setTimeout(() => {
        this.copyMessage = 'Copy';
        this.cdr.detectChanges();
      }, 3000);
      this.cdr.detectChanges();
    });
  }

  submitEmail() {
    if (!this.name) {
      alert('Please enter an name');
      return;
    }
    if (!this.email) {
      alert('Please enter an email');
      return;
    }
    this.user_details = {
      email: this.email,
      name: this.name,
    } as userDetails;
    this.appState.receiveMessage(this.user_details);
    var all_user_details = localStorage.getItem('all_user_details');
        var allNotification = localStorage.getItem(`${this.user_details?.email}`);

    if (all_user_details) {
      this.allUserDetail = JSON.parse(all_user_details);
      var aldreadyHave = this.allUserDetail.find((e) => e.email == this.email);
    }
    if (!aldreadyHave) {
      this.allUserDetail.push(this.user_details);
      // localStorage.setItem('user_details', JSON.stringify(user_details));
      localStorage.setItem('all_user_details', JSON.stringify(this.allUserDetail));
      // localStorage.setItem('is_mail_given', 'true');
      var payload = {
        from: 'user_details',
        data: this.user_details,
      };
      this.ws.sendMessage(JSON.stringify(payload));
      console.log(this.allUserDetail);
    }
    this.allNotification = JSON.parse(allNotification || '[]')
    this.mapToAllUsers()
    this.appState.showEmailPopup = false;
  }
  setActive(mail: string) {
    this.activeUserEmail = mail;
    this.appState.activeUserEmail = this.activeUserEmail;
    var all_messages = localStorage.getItem('all_messages');
    if (all_messages) {
      this.allMessages = JSON.parse(all_messages);
    }
    this.messages = this.allMessages.filter((e) => {
      return (
        (e.from == this.activeUserEmail && e.to == this.user_details.email) ||
        (e.from == this.user_details.email && e.to == this.activeUserEmail)
      );
    });
    this.clearNotification()
    this.scrollView();
  }
  clearNotification(){
    this.allNotification = this.allNotification.map((n: any) => {
      if (n.email === this.activeUserEmail) {
        return {
          ...n,
          count: 0
        };
      }
      return n;
    });
    localStorage.setItem(`${this.user_details?.email}`, JSON.stringify(this.allNotification))
    this.mapToAllUsers()
  }
  sendMessage() {
    if (!this.message.trim()) return;
    if (!this.activeUserEmail) {
      alert('Please select a user to chat with');
      return;
    }
    const msg = {
      from: this.user_details?.email || 'me',
      text: this.message,
      to: this.activeUserEmail,
    };
    this.messages.push(msg);
    this.allMessages.push(msg);

    localStorage.setItem('all_messages', JSON.stringify(this.allMessages));
    var payload = {
      from: 'messages',
      to: this.activeUserEmail,
      data: msg,
    };
    this.ws.sendMessage(JSON.stringify(payload));
    this.message = '';
    this.scrollView();
  }
  scrollView() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.messages');
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  }

}

export interface userDetails {
  name: string;
  email: string;
}
