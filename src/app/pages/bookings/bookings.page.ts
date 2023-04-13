import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { Observable, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import Chart from 'chart.js/auto'
import { TrashService } from 'src/app/services/trash/trash.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: any
  chart: Chart
  user_type: string
  cityCounts: any
  brgyCounts: any
  brgy:string
  constructor(
    private storage: Storage,
    private router: Router,
    private bookingService: BookingService,
    private alertController: AlertController,
    private collectorService: CollectorService,
    private toastController: ToastController,
    private notificationService: NotificationsService,
    private trashService: TrashService,
    private customerService: CustomerService
  ) {
    
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getBookings()
      event.target.complete();
    }, 2000);
  };


  async getLocalVars(){
    this.user_type = await this.storage.get('user_type')
  }

  async getCounts(){
    this.user_type = await this.storage.get('user_type')
    if (this.user_type == 'customer'){
      const user = await this.storage.get('user')
      const accessToken = await this.storage.get('accessToken')
      await this.customerService.getCustomer(user, accessToken).subscribe(async (response) => {
        if(response == null) this.router.navigate(['/']);
        this.brgy = response.address.barangay
        await this.trashService.getBarangayCounts(this.brgy).subscribe(async (data) => {
          this.brgyCounts = [data.january, data.february, data.march, data.april, data.may, data.june, data.july, data.august, data.september, data.october, data.november, data.december]
          this.showCustomerChart('barangayCounts',this.brgyCounts, "Garbage in your barangay")
        })
        await this.trashService.getCityCounts().subscribe(async (data) => {
          this.cityCounts = [data.january,data.february,data.march,data.april,data.may,data.june,data.july,data.august,data.september,data.october,data.november,data.december]
          this.showCustomerChart('cityCounts',this.cityCounts, "Garbage in Iligan")
        })
      })
    }
  }

  async showCustomerChart(chart_name:string, counts:any, label:string){ 
    this.user_type = await this.storage.get('user_type')
    if (this.user_type == 'customer'){
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec']
      const data = {
        labels: labels,
        datasets: [{
          label: label,
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 1
          }]
        };
      this.chart = new Chart(chart_name, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      });
    }
  }


  async getBookings(){
    const user_id = await this.storage.get('user')
    this.user_type = await this.storage.get('user_type')
    if(user_id == null) this.router.navigate(['/']);
    if(this.user_type == "collector"){
      await this.bookingService.getCollectorBookings(user_id).subscribe(data => {
        this.bookings = data
      })
    }
  }

  async cancelBooking(id:any){
    const accessToken = await this.storage.get("accessToken")
    const user = await this.storage.get("user")
    const alert = await this.alertController.create({
      header: 'Are you sure you want to Cancel?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            await this.collectorService.getCollector(user, accessToken).subscribe(async data => {
              if(data == null) this.router.navigate(['/']);
              const body = {"status" : "pending", "collector" : null, "collector_id" : null }
              await this.bookingService.updateBooking(id, accessToken, body).subscribe(async (response) => {
                this.getBookings()
                const toast = await this.toastController.create({
                  message: 'Cancelled',
                  duration: 2000,
                  position: "bottom"
                });
                await this.bookingService.getBooking(id).subscribe(async (response)=>{
                  await this.notificationService.saveNotif({customer_id: response.customer_id,status:"cancel", message : "Collector cancelled your booking"}).subscribe()
                }) 
                toast.present(); 
                this.router.navigate(['/tabs/tabs/bookings']); 
              },
              async (error: HttpErrorResponse)=> {
                const toast = await this.toastController.create({
                  message: 'Booking already taken',
                  duration: 2000,
                  position: "bottom"
                });
                toast.present();
                this.router.navigate(['/tabs/tabs/home']);    
              })
            })
          },
        },
      ],
    });

    await alert.present();
  }
  
  async disposeBooking(id:any){
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
            await this.collectorService.getCollector(user, accessToken).subscribe(async data => {
              if(data == null) this.router.navigate(['/']);
              const body = {"status" : "success"}
              await this.bookingService.updateBooking(id, accessToken, body).subscribe(async (response) => {
                this.getBookings()
                const toast = await this.toastController.create({
                  message: 'Successful garbage disposal',
                  duration: 2000,
                  position: "bottom"
                });
                await this.bookingService.getBooking(id).subscribe(async (response)=>{
                  await this.notificationService.saveNotif({customer_id: response.customer_id,status:"success", message : "Successful garbage disposal"}).subscribe()
                }) 
                toast.present(); 
                this.router.navigate(['/tabs/tabs/bookings']); 
              },
              async (error: HttpErrorResponse)=> {
                const toast = await this.toastController.create({
                  message: 'Booking already taken',
                  duration: 2000,
                  position: "bottom"
                });
                toast.present();
                this.router.navigate(['/tabs/tabs/home']);    
              })
            })
          },
        },
      ],
    });

    await alert.present();
  }

  async pickupBooking(id:any){
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
            await this.collectorService.getCollector(user, accessToken).subscribe(async data => {
              if(data == null) this.router.navigate(['/']);
              const body = {"status" : "picked-up"}
              await this.bookingService.updateBooking(id, accessToken, body).subscribe(async (response) => {
                this.getBookings()
                const toast = await this.toastController.create({
                  message: 'Picked up',
                  duration: 2000,
                  position: "bottom"
                });
                await this.bookingService.getBooking(id).subscribe(async (response)=>{
                  await this.notificationService.saveNotif({customer_id: response.customer_id,status:"success", message : "Collector picked up your garbage"}).subscribe()
                })
                toast.present(); 
                this.router.navigate(['/tabs/tabs/bookings']); 
              },
              async (error: HttpErrorResponse)=> {
                const toast = await this.toastController.create({
                  message: 'Booking already taken',
                  duration: 2000,
                  position: "bottom"
                });
                toast.present();
                this.router.navigate(['/tabs/tabs/home']);    
              })
            })
          },
        },
      ],
    });

    await alert.present();
  }
  ngOnInit() {
    this.getLocalVars()
    this.getBookings()
    const observable = interval(environment.refresh_interval)
      observable.subscribe(async () => {
        this.getBookings()
    })
    this.getCounts()
    console.log(this.brgyCounts)
    
    
  }

}
