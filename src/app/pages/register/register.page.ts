import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private customerService: CustomerService, private collectorService: CollectorService, private router: Router, private storage: Storage, private toastController: ToastController) { }
  values = {
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
    type: ""
  }
  segmentChanged(e: any){
    this.values.type = e.detail.value;
  } 
  
  async logForm(){
    if (this.values.type === "customer") {
      await this.customerService.saveCustomer(this.values).subscribe(async (data) => {
        await this.storage.set('accessToken', data['accessToken']);
        await this.storage.set('user', data['user']);
        await this.storage.set('user_type', data['user_type']);
        this.router.navigate(['/settings']);
      },async (e) => {
        const toast = await this.toastController.create({
          message: e,
          duration: 3000,
          position: 'middle',
          cssClass: 'error-toast',
          icon: 'ios-alert-outline'
        });
        toast.present();
      });
    } else if (this.values.type === "collector") {
      await this.collectorService.saveCollector(this.values).subscribe(async (data) => {
        await this.storage.set('accessToken', data['accessToken']);
        await this.storage.set('user', data['user']);
        await this.storage.set('user_type', data['user_type']);
        this.router.navigate(['/tabs/tabs/home']);
      },async (e) => {
        const toast = await this.toastController.create({
          message: "Invalid Inputs",
          duration: 3000,
          position: 'middle',
          cssClass: 'error-toast',
          icon: 'ios-alert-outline'
        });
        toast.present();
      });
    }
    
    
  }
  ngOnInit() {
  }

}
