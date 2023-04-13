import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { CustomerService } from '../services/customer/customer.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CollectorService } from '../services/collector/collector.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  
  constructor(private storage: Storage, 
    private customerService: CustomerService, 
    private router: Router, 
    private toastController: ToastController,
    private collectorService: CollectorService) {
    this.getUser()
  }
  barangays = environment.barangay_list
  values= {
    fullname: "",
    phone_number: "",
    email: "",
    user_type: "",
    address: {
      house: '', 
      purok: '', 
      barangay: '', 
      city: ''
    }
  }
  user_type: string;

  async getUser(){
    
    const accessToken = await this.storage.get('accessToken')
    const user_id = await this.storage.get('user')
    const user_type = await this.storage.get('user_type')
    this.user_type = user_type
    console.log(user_type)
    if(user_id == null) this.router.navigate(['/']);

    if(user_type == "customer"){
      await this.customerService.getCustomer(user_id,accessToken).subscribe(data =>{
        if(data == null) this.router.navigate(['/']);
        this.values.fullname = data.fullname;
        this.values.email = data.email;
        this.values.user_type = data.user_type;
        this.values.phone_number = data.phone_number;
        this.values.address.house = data.address.house;
        this.values.address.purok = data.address.purok;
        this.values.address.barangay = data.address.barangay;
        this.values.address.city = data.address.city;
      }, async (e) => {
        console.log(e);
      })
    } else if (user_type == "collector"){
      await this.collectorService.getCollector(user_id,accessToken).subscribe(data =>{
        if(data == null) this.router.navigate(['/']);
        this.values.fullname = data.fullname;
        this.values.email = data.email;
        this.values.user_type = data.user_type;
        this.values.phone_number = data.phone_number;
      }, async (e) => {
        console.log(e);
      })
    }
    

  }
  
  addressCheck(){
    return (this.values.address.house === "" || this.values.address.purok === "" || this.values.address.barangay === "")
  }
  async updateInfos(){
    const accessToken = await this.storage.get('accessToken')
    const user_id = await this.storage.get('user')
    const user_type = await this.storage.get('user_type')
    if(user_type == "customer"){
      await this.customerService.updateCustomer(user_id, accessToken, this.values).subscribe(async (data) =>{
        const toast = await this.toastController.create({
          message: 'Update Successful',
          duration: 1500,
          position: "bottom"
        });
        
        await toast.present();
        this.router.navigate(['/tabs/tabs/profile']);
      }, async (e) => {
        console.log(e);
      })
    } else if(user_type == "collector"){
      await this.collectorService.updateCollector(user_id, accessToken, this.values).subscribe(async (data) =>{
        const toast = await this.toastController.create({
          message: 'Update Successful',
          duration: 1500,
          position: "bottom"
        });
    
        await toast.present();
        this.router.navigate(['/tabs/tabs/profile']);
      }, async (e) => {
        console.log(e);
      })
    }
    
    console.log(this.values)
  }
  ngOnInit() {
  }

}
