import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiLink:string
  constructor(private http: HttpClient) {
    this.apiLink = environment.API_LINK.concat('feedback/');
  }

  saveFeedback(body: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink; 
    return this.http.post<any>(url, body , { headers });
  }

  getFeedbacks(id:string){
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink.concat(id)
    return this.http.get<any>(url , { headers });
  }
}
