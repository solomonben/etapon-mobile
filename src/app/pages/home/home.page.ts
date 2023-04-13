import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Observable, interval } from 'rxjs';
import { BookingService } from 'src/app/services/booking/booking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user_type:any
  bookings:any
  pending_bookings: any
  collector=""
  collector_id=""
  collector_number=""
  message = ""
  svg = ""
  observable_subscription: any
  constructor(private storage: Storage, private router: Router, private bookingService: BookingService) {
    this.getLocalVars()
    
  }
  ngOnInit() {
    this.getBookings()
    
  }

  ngOnDestroy(){
    this.observable_subscription.unsubscribe()
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getBookings()
      console.log(this.bookings)
      event.target.complete();
    }, 2000);
  };
  async getLocalVars() {
    this.user_type = await this.storage.get('user_type')

  }

  async getBookings(){
    const user_id = await this.storage.get('user')
    const user_type = await this.storage.get('user_type')
    if(user_id == null) this.router.navigate(['/']);
    if(user_type == 'customer'){
      await this.bookingService.getBookingByCustomer(user_id).subscribe(data =>{
        if (data != false){
          this.bookings = data[0]
          this.collector = data[0].collector.name
          this.collector_number = data[0].collector.phone_number
          this.collector_id = data[0].collector_id
          this.messageSvg(data[0].status)
        }
      },async (error) => {
        console.log(error)
      })
      const observable = interval(environment.refresh_interval)
      this.observable_subscription =  observable.subscribe(async () => {
        await this.bookingService.getBookingByCustomer(user_id).subscribe(data =>{
          if(data != false){
            this.bookings = data[0]
            this.messageSvg(data[0].status)
          }
          
        }) 
      },async (error) => {
        console.log(error)
      })
    } else if (user_type == 'collector'){
      await this.bookingService.getPendingBookings().subscribe(data => {
        this.pending_bookings = data
      })
    }
    
    
  }

  messageSvg(status: string){
    if (status === "pending"){
      this.message = "Waiting for rider to pickup";
      this.svg = "/assets/pending_status.svg"
    } else if(status === "booked"){
      this.message = "Rider is on the way"
      this.svg = "/assets/on_the_way.svg"
    } else if(status === "picked-up"){
      this.message = "Picked up, disposing garbage"
      this.svg = "/assets/disposing_trash.svg"
    } else if(status === "success"){
      this.message = "Successful garbage disposal"
      this.svg = "/assets/successful.svg"
    }
  }
}
