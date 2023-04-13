import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { TalkService } from 'src/app/services/talk/talk.service';

@Component({
  selector: 'app-booking-slip',
  templateUrl: './booking-slip.component.html',
  styleUrls: ['./booking-slip.component.scss'],
})
export class BookingSlipComponent implements OnInit {
  @Input() biodegradable: string;
  @Input() non_biodegradable: string;
  @Input() recyclable: string;
  @Input() created_at: string;
  @Input() payment_amount: string;
  @Input() payment_mode: string;
  @Input() status: string;
  @Input() booking_id: string;
  @Input() collector_name: any;
  @Input() collector_number: any;
  @Input() message: string;
  @Input() collector_id: string;
  booking_time: string;
  @Input() svg = ""
  constructor(
    private storage: Storage,
    private alertController: AlertController,
    private collectorService: CollectorService,
    private router: Router,
    private bookingService: BookingService,
    private toastController: ToastController,
    private notificationService: NotificationsService,
    private talkService: TalkService
    ) {
  }

  statusMessage(){
    if (this.status === "pending"){
      this.message = "Waiting for rider to pickup";
      this.svg = "/assets/pending_status.svg"
    } else if(this.status === "booked"){
      this.message = "Rider is on the way"
      this.svg = "/assets/on_the_way.svg"
    } else if(this.status === "picked-up"){
      this.message = "Picked up, disposing garbage"
      this.svg = "/assets/disposing_trash.svg"
    } else if(this.status === "success"){
      this.message = "Successful garbage disposal"
      this.svg = "/assets/successful.svg"
    }
    
  }

  async finishBooking(){
    const accessToken = await this.storage.get("accessToken")
    const alert = await this.alertController.create({
      header: 'Confirm Action',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            const body = {"status" : "done"}
            await this.bookingService.updateBooking(this.booking_id, accessToken, body).subscribe(async (response) => {
              const toast = await this.toastController.create({
                message: 'Successful garbage disposal',
                duration: 2000,
                position: "bottom"
              });
              await toast.present(); 
              this.router.navigate(['/tabs/tabs/home']).then(()=> {
                window.location.reload();
              }); 
            },
            async ()=> {
              const toast = await this.toastController.create({
                message: 'Failed',
                duration: 2000,
                position: "bottom"
              });
              await toast.present();
              this.router.navigate(['/tabs/tabs/home']).then(()=> {
                window.location.reload();
              });     
            })
            
          },
        },
      ],
    });

    await alert.present();
  }

  async cancelBooking(){
    const accessToken = await this.storage.get("accessToken")
    const alert = await this.alertController.create({
      header: 'Confirm Action',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            const body = {"status" : "cancelled"}
            await this.bookingService.updateBooking(this.booking_id, accessToken, body).subscribe(async (response) => {
              const toast = await this.toastController.create({
                message: 'Booking Cancelled',
                duration: 2000,
                position: "bottom"
              });
              await this.bookingService.getBooking(this.booking_id).subscribe(async (response)=>{
                console.log(response)
                await this.notificationService.saveNotif({collector_id: response.collector_id,status:"cancel", message : "Customer cancelled the booking"}).subscribe()
              })
              await toast.present(); 
              this.router.navigate(['/tabs/tabs/home']).then(()=> {
                window.location.reload();
              }); 
            })
          },
        },
      ],
    });

    await alert.present();
  }

  async contactCollector(){
      console.log(this.collector_id);
      let body = {
        collector_id: this.collector_id,
        customer_id:  await await this.storage.get("user")
      }
      await this.talkService.saveConversation(body).subscribe(conversation =>{
        const data = {
          "collector_name" : conversation.collector_name,
          "customer_name" : conversation.customer_name,
          "_id" : conversation._id,
          "collector_id": conversation.collector_id,
          "customer_id": conversation.customer_id
        }
        this.router.navigate(['/chat'], { queryParams: data  });
      })

  }
  formatDate(){
    this.booking_time = new Date(this.created_at).toLocaleString()
  }
  ngOnInit() {
    this.statusMessage()
    this.formatDate()
  }

}
