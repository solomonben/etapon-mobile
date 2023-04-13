import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.page.html',
  styleUrls: ['./booking-form.page.scss'],
})
export class BookingFormPage implements OnInit {
  
  constructor(private storage: Storage, 
    private bookingService: BookingService, 
    private router: Router,
    private customerService: CustomerService) {
    this.checkUserLogin()
  }
  delivery_fee = 0
  total_amount = this.delivery_fee
  price_per_bag_non_rec = 65
  price_per_bag_bio = 80
  values = {
    biodegradable: 0,
    non_biodegradable: 0,
    recyclable: 0,
    payment_mode: "",
    payment_amount: this.total_amount,
    prices : {
        biodegradable: 0.00,
        non_biodegradable: 0.00,
        recyclable: 0.00,
    },
    collector_fee : 0.00,
    address: {
      house : "",
      purok: "",
      barangay : "",
      city: ""
    },
    customer: {
      name: "",
      email: "",
      phone_number: ""
    }
  }

  changeTotal(e: any){
    this.values.payment_amount =  (this.values.biodegradable * this.price_per_bag_bio) + (this.values.non_biodegradable * this.price_per_bag_non_rec) + (this.values.recyclable * this.price_per_bag_non_rec) + this.delivery_fee
  }

  collectorFee(brgy: any){
    if (environment.prices.price_60.includes(brgy)){
      this.delivery_fee = 60
    }
    if (environment.prices.price_40.includes(brgy)){
      this.delivery_fee = 40
    }
    if (environment.prices.price_30.includes(brgy)){
      this.delivery_fee = 30
    }
  }

  async checkUserLogin(){
    const accessToken = await this.storage.get('accessToken')
    const user = await this.storage.get('user')
    if(user == null) this.router.navigate(['/']);
    await this.customerService.getCustomer(user,accessToken).subscribe(data =>{
      if(data == null) this.router.navigate(['/']);
      this.values.customer.name = data.fullname
      this.values.customer.email = data.email
      this.values.customer.phone_number = data.phone_number
      this.values.address.house = data.address.house
      this.values.address.purok = data.address.purok
      this.values.address.barangay = data.address.barangay
      this.values.address.city = data.address.city
      if (data.address.house == "" || data.address.barangay == "" || data.address == ""){
        this.router.navigate(['/settings']);
      }
      this.collectorFee(data.address.barangay)
    }, async (e) => {
      console.log(e);
    })
  }

  async bookingForm(){
    const customer_id = await this.storage.get('user')
    const body = {
      "biodegradable" : this.values.biodegradable,
      "non_biodegradable" : this.values.non_biodegradable,
      "recyclable" : this.values.recyclable,
      "payment" : {
        "mode": this.values.payment_mode,
        "amount" : this.values.payment_amount
        },
      "customer_id": customer_id,
      "status" : "pending",
      "address": {
        "house" : this.values.address.house,
        "purok": this.values.address.purok,
        "barangay" : this.values.address.barangay,
        "city": this.values.address.city
      },
      "customer": {
        "name": this.values.customer.name,
        "email": this.values.customer.email,
        "phone_number": this.values.customer.phone_number
      },
      "collector_fee" : this.delivery_fee
    }
    console.log(body)
    await this.bookingService.saveBooking(body).subscribe(()=> {
      this.router.navigate(['/tabs/tabs/home']);
    }, async (e) => {
      console.log(e); 
    })
  }
  changeBio(e: any){
    console.log(e)
    //this.values.biodegradable = e.detail.value;
  }
  ngOnInit() {
  }

}
