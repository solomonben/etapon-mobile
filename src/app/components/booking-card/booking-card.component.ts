import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent implements OnInit {
  @Input() address: string;
  @Input() createdAt: string;
  @Input() biodegradable: string;
  @Input() non_biodegradable: string;
  @Input() recyclable: string;
  @Input() payment_amount: string;
  @Input() payment_mode: string;
  @Input() booking_id: string;
  @Input() fullname: string;
  
  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationsService,
    private storage: Storage,
    private collectorSerice: CollectorService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
    ) { }
  
  async pickUpBooking(id:string){
    const accessToken = await this.storage.get("accessToken")
    const user = await this.storage.get("user")
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
            await this.collectorSerice.getCollector(user, accessToken).subscribe(async data => {
              if(data == null) this.router.navigate(['/']);
              const collector_data = {
                "name" : data.fullname,
                "email" : data.email,
                "phone_number" : data.phone_number
              }
              const body = {"status" : "booked", "collector" : collector_data, "collector_id" : data._id }
              await this.bookingService.updateBooking(id, accessToken, body).subscribe(async (response) => {
                const toast = await this.toastController.create({
                  message: 'Booked',
                  duration: 1000,
                  position: "bottom"
                });
                await this.bookingService.getBooking(id).subscribe(async (response)=>{
                  console.log(response)
                  await this.notificationService.saveNotif({customer_id: response.customer_id,status:"warning", message : "Collector has booked your garbage"}).subscribe()
                }) 
                toast.present();
                this.router.navigate(['/tabs/tabs/bookings']).then(()=> {
                  window.location.reload();
                }); 
              },
              async (error: HttpErrorResponse)=> {
                const toast = await this.toastController.create({
                  message: 'Booking already taken',
                  duration: 2000,
                  position: "bottom"
                });
                await toast.present();
                this.router.navigate(['/tabs/tabs/home']).then(()=> {
                  window.location.reload();
                });     
              })
            })
          },
        },
      ],
    });

    await alert.present();
    
    
  }
  ngOnInit() {}

}
