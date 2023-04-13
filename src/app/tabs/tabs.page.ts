import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  icon:string
  icon2:string
  constructor(private storage: Storage) {
    this.checkUser()
  }
  async checkUser(){
    const user_type = await this.storage.get('user_type')
    if (user_type == "collector") {
      this.icon = "book"
      this.icon2 = "star"
    } else if (user_type == "customer") {
      this.icon = "bar-chart"
      this.icon2 = "time"
    }
  }
}
