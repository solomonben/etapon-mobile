import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { interval } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  user_type: string
  user: string
  notifs: any
  constructor(
    private storage: Storage,
    private notificationService: NotificationsService
  ) {  
    this.getNotifs()
  }
  ngOnInit() {
    this.getLocalVars()
    const observable = interval(environment.refresh_interval)
      observable.subscribe(async () => {
        this.getNotifs()
    })
  }
  
  handleRefresh(event: any) {
    setTimeout(() => {
      this.getNotifs()
      event.target.complete();
    }, 2000);
  };
  
  async getLocalVars() {
    this.user_type = await this.storage.get('user_type')
    this.user = await this.storage.get("user")
  }
  async getNotifs(){
    console.log(this.user_type)
    console.log(this.user_type === "customer")
    if (this.user_type == "customer"){
      console.log("aaaaaaaaa")
      await this.notificationService.getCustomerNotifs(this.user).subscribe(async (response)=>{
        this.notifs = response
      })
    }else {
      await this.notificationService.getCollectorNotifs(this.user).subscribe(async (response)=>{
        this.notifs = response
        console.log(this.notifs)
      })
    }
  }

  
}
