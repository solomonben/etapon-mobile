import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Storage } from '@ionic/storage-angular'; 
import { Router } from '@angular/router';
import { CollectorService } from 'src/app/services/collector/collector.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private customerService: CustomerService,
    private storage: Storage,
    private toastController: ToastController,
    private router: Router,
    private collectorService: CollectorService) { }
  values = {
    email: "",
    password: "",
    type:""
  }
  segmentChanged(e: any){
    this.values.type = e.detail.value;
  } 
  async loginForm(){
    if (this.values.type == "customer"){
      await this.customerService.loginCustomer(this.values).subscribe(async (data) => {
        console.log(data);
        await this.storage.set('accessToken', data['accessToken']);
        await this.storage.set('user', data['user']);
        await this.storage.set('user_type', data['user_type']);
        this.router.navigate(['/tabs/tabs/home']);
      },async (e) => {
        console.log(e);
        const toast = await this.toastController.create({
          message: 'Invalid Email or Password',
          duration: 3000,
          position: 'middle',
          cssClass: 'error-toast',
          icon: 'ios-alert-outline'
        });
        toast.present();
      }
        
      );
    } else if (this.values.type == "collector"){
      await this.collectorService.loginCollector(this.values).subscribe(async (data) => {
        console.log(data);
        await this.storage.set('accessToken', data['accessToken']);
        await this.storage.set('user', data['user']);
        await this.storage.set('user_type', data['user_type']);
        this.router.navigate(['/tabs/tabs/home']);
      },async (e) => {
        console.log(e);
        const toast = await this.toastController.create({
          message: 'Invalid Email or Password',
          duration: 3000,
          position: 'middle',
          cssClass: 'error-toast',
          icon: 'ios-alert-outline'
        });
        toast.present();
      }
        
      );
    }
    
  }
  ngOnInit() {}

}
