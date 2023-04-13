import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrashService {

  constructor(private http: HttpClient) { }
  apiLink = environment.API_LINK.concat("trashes/")
  getCityCounts(): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink
    return this.http.get<any>(url , { headers });
  }

  getBarangayCounts(barangay: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink.concat("barangay/"+barangay)
    return this.http.get<any>(url , { headers });
  }
}
