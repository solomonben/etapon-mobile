import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  apiLink: string;
  constructor(private http: HttpClient) {
    this.apiLink = environment.API_LINK.concat("notifications/")
  }
  saveNotif(body: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink; 
    return this.http.post<any>(url, body , { headers });
  }

  getCollectorNotifs(id:any): Observable<any>{
    console.log(id)
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink.concat("collector/" + id);
    return this.http.get(url, { headers })
  }

  getCustomerNotifs(id:any): Observable<any>{
    console.log(id)
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink.concat("customer/" + id);
    return this.http.get(url, { headers })
  }
}
