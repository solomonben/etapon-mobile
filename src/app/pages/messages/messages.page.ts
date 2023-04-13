import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CollectorService } from 'src/app/services/collector/collector.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { TalkService } from 'src/app/services/talk/talk.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  
  constructor( 
    private storage: Storage,
    private customerService: CustomerService,
    private collectorService: CollectorService,
    private talkService: TalkService,
    private router: Router) {
      
  };
  conversations:any
  user_type: any
  ngOnInit() {
    this.getConversations();
  }


  async getConversations() {
    const user = await this.storage.get("user")
    const user_type = await this.storage.get("user_type")
    this.user_type = user_type
    this.talkService.getConversations(user, user_type).subscribe(response =>{
      this.conversations = response
      console.log(this.conversations)
    })
  }

  async navigateToChat(conversation:any) {
    console.log(conversation)
    const data = {
      "collector_name" : conversation.collector_name,
      "customer_name" : conversation.customer_name,
      "_id" : conversation._id,
      "collector_id": conversation.collector_id,
      "customer_id": conversation.customer_id
    }
    this.router.navigate(['/chat'], { queryParams: data  });
  }
  

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  };
}
