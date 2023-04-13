import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private customerService: CustomerService, 
    private storage: Storage, 
    private router: Router, 
    private alertController: AlertController,
    private collectorServiceL: CollectorService) {
    this.getUser()
  }
  values= {
    fullname: "",
    phone: "",
    email: ""
  }
  async getUser(){
    const accessToken = await this.storage.get('accessToken')
    const user_id = await this.storage.get('user')
    const user_type = await this.storage.get('user_type')
    if(user_id == null) this.router.navigate(['/']);
    if(user_type == "customer"){
      await this.customerService.getCustomer(user_id,accessToken).subscribe(data =>{
        if(data == null) this.router.navigate(['/']);
        this.values.fullname = data.fullname;
        this.values.email = data.email;
        this.values.phone = data.phone_number;
      }, async (e) => {
        console.log(e);
      })
    } else if(user_type == "collector"){
      await this.collectorServiceL.getCollector(user_id,accessToken).subscribe(data =>{
        if(data == null) this.router.navigate(['/']);
        this.values.fullname = data.fullname;
        this.values.email = data.email;
        this.values.phone = data.phone_number;
      }, async (e) => {
        console.log(e);
      })
    }
    

  }

  async logOut(){
    const alert = await this.alertController.create({
      header: 'Confirm Log Out',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            await this.storage.remove('accessToken')
            await this.storage.remove('user')
            await this.storage.remove('user_type')
            this.router.navigate(['/'])
          },
        },
      ],
    });
    await alert.present();
  }
  

  ngOnInit() {
  }

}
