import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  apiLink: string;
  constructor(private http: HttpClient) {
    this.apiLink = environment.API_LINK.concat('bookings/');
  }

  saveBooking(body: any, ): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink; 
    return this.http.post<any>(url, body , { headers });
  }

  getBookingByCustomer(customer_id: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink.concat("get_bookings/"+customer_id)
    return this.http.get<any>(url , { headers });
  }

  getBooking(booking_id: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json' 
    }
    const url = this.apiLink.concat(booking_id)
    return this.http.get<any>(url , { headers });
  }

  getPendingBookings(): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink
    return this.http.get<any>(url , { headers });
  }

  getCollectorBookings(collector_id: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink.concat("collector_bookings/" + collector_id)
    return this.http.get<any>(url , { headers });
  }

  getHistoryBookings(customer_id: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json'
    }
    const url = this.apiLink.concat("history/" + customer_id)
    return this.http.get<any>(url , { headers }); 
  }

  updateBooking(id:string, accessToken: string, body: any): Observable<any>{
    const headers = {
      'Content-Type': 'application/json',
      'authorization' : accessToken
    }
    const url = this.apiLink.concat(id); 
    return this.http.put<any>(url, body , { headers })
  }
}
