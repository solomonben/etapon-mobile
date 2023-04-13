import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  bookings: any
  user_type: any
  feedbacks: any
  constructor(
    private bookingService: BookingService,
    private storage: Storage,
    private router: Router,
    private feedbackService: FeedbackService) { }
  async getBookings(){
    const user_id = await this.storage.get('user')
    const user_type = await this.storage.get('user_type')
    this.user_type = user_type
    if(user_id == null) this.router.navigate(['/']);
    if(user_type == "customer"){
      await this.bookingService.getHistoryBookings(user_id).subscribe(data => {
        this.bookings = data
        console.log(this.bookings)
      })
    }
  }

  async getFeedbacks(){
    const user_type = await this.storage.get('user_type')
    const user_id = await this.storage.get('user')
    if (user_type == 'collector'){
      await this.feedbackService.getFeedbacks(user_id).subscribe( data=> {
        this.feedbacks = data
        console.log(this.feedbacks)
      })
    }
  }
  ngOnInit() {
    this.getBookings()
    this.getFeedbacks()
  }

}
