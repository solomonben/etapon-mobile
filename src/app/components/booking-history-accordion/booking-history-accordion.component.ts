import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';

@Component({
  selector: 'app-booking-history-accordion',
  templateUrl: './booking-history-accordion.component.html',
  styleUrls: ['./booking-history-accordion.component.scss'],
})
export class BookingHistoryAccordionComponent implements OnInit {

  @Input() collectorName: string;
  @Input() dateTime: string;
  @Input() address: string;
  @Input() noBio: any;
  @Input() noNonBio: any;
  @Input() noRecyc: any;
  @Input() collectorFee: string;
  @Input() total: string;
  @Input() accordionName: string;
  @Input() collectorId:string;
  @Input() rated:any
  @Input() rated_rating: any
  @Input() rated_comment:string
  @Input() bookingId:string
  priceBio:number  
  priceNonBio:number  
  priceRecyc: number
  subtotal: number
  rating=1
  message:string

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private storage: Storage,
    private feedbackService: FeedbackService,
    private toastController: ToastController
    ) {
    
  }

  async rateCollectorService(){
    if(this.rating && this.message){
      const accessToken = await this.storage.get('accessToken')
      const booking_update_body = {
        rated: true,
        rating : this.rating,
        comment : this.message
      }
      await this.bookingService.updateBooking(this.bookingId,accessToken, booking_update_body).subscribe()
      
      const feedback_body = {
        collector_id : this.collectorId,
        message : this.message,
        rating : this.rating,
        customer_id : await this.storage.get('user')
      }
      await this.feedbackService.saveFeedback(feedback_body).subscribe()
      this.router.navigate(['/tabs/tabs/history']).then(()=> {
        window.location.reload();
      });
    } else {
      const toast = await this.toastController.create({
        message: 'Must fill up Comments',
        duration: 1500,
        position: 'bottom'
      });
  
      await toast.present();
    }
    
  }
  pinFormatter(value: number) {
    return `${value}★`;
  }

  ngOnInit() {
    console.log(this.rated)
    this.priceBio = this.noBio * 80
    this.priceNonBio = +this.noNonBio * 65
    this.priceRecyc = +this.noRecyc * 65
    this.subtotal = this.priceBio + this.priceNonBio + this.priceRecyc
  }

}
