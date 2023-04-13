import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  apiLink: string;
  message: string;
  constructor(private http: HttpClient) {
    this.apiLink = environment.API_LINK.concat('collectors/');
  }
  
  saveCollector(body: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    if(body.password == body.confirmpassword) {
      var doc = {
        "fullname" : body.fullname,
        "phone_number" : body.phone,
        "email" : body.email,
        "password" : body.password
      }
      console.log(doc)
      const url = this.apiLink; 
      return this.http.post<any>(url, doc , { headers });
    }else {
      body = {"message" : "Password did not Match"};
      return body;
    }
  }

  loginCollector(body:any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    var doc = {
      "email" : body.email,
      "password" : body.password
    }
    const url = this.apiLink.concat('login'); 
    return this.http.post<any>(url, doc , { headers })
   
  }
  updateCollector(id:string, accessToken: string, body: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json',
      'authorization' : accessToken
    }
    const url = this.apiLink.concat(id); 
    return this.http.put<any>(url, body , { headers })
  }
  getCollector(id:string, accessToken: string): Observable<any>{
    const headers = {
      'Content-Type': 'application/json',
      'authorization' : accessToken
    }
    const url = this.apiLink.concat(id); 
    return this.http.get<any>(url, { headers })
  }

  logoutCollector(accessToken: string): Observable<any>{
    const headers = {
      'Content-Type': 'application/json',
      'token' : accessToken
    }
    const url = this.apiLink.concat("logout"); 
    return this.http.post<any>(url, { headers })
  }
}
