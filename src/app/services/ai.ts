import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environmentKey } from '../../environment';
@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private http: HttpClient) {}
  groq_key:string = environmentKey.groq_key
  askAI(message: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.groq_key}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    };

    return this.http.post(
      'https://api.groq.com/openai/v1/chat/completions',
      body,
      { headers }
    );
  }
}