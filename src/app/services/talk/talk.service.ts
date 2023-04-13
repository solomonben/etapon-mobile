import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyMxRecord } from 'dns';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TalkService {
  apiLink: string;
  constructor(private http: HttpClient) {
    this.apiLink = environment.API_LINK.concat('messages/');
  }
  saveConversation(body: any, ): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink; 
    return this.http.post<any>(url, body , { headers });
  }

  getConversations(id:string, user_type:string): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    let url = this.apiLink
    if (user_type == "customer"){
      url = url.concat("customer/"+id)
    } else {
      url = url.concat("collector/"+id)
    }
    return this.http.get<any>(url , { headers });
  }

  updateMessages(id:string, message:string, sender:string): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink
    const body = {
      id:id,
      message: message,
      sender: sender
    }
    console.log(body)
    return this.http.put<any>(url, body , { headers })
  }

  getMessages(id:string): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    console.log(id)
    let url = this.apiLink.concat(id)
    return this.http.get<any>(url , { headers });
  }

}
