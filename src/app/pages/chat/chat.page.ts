import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { io } from "socket.io-client";
import { TalkService } from 'src/app/services/talk/talk.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('chatWindow', { static: false }) content: IonContent;
  socket: any; 
  constructor(private storage: Storage,
    private route: ActivatedRoute,
    private talkService: TalkService) { }
  user_type: any
  message: string
  messageList: {message: string, userName: string}[] = [];
  data = {
    collector_name : '',
    customer_name : '',
    _id : '',
    collector_id: '',
    customer_id: ''
  }

  current_user:string
  
  async ngOnInit() {
    
    this.user_type = await this.storage.get("user_type")
    
    this.route.queryParams.subscribe(params => {
      this.data.collector_name = params['collector_name'];
      this.data.customer_name = params['customer_name'];
      this.data._id = params['_id'];
      this.data.collector_id = params['collector_id'];
      this.data.customer_id = params['customer_id'];
    });

    if(this.user_type == 'customer') {
      this.current_user = this.data.customer_name
    } else {
      this.current_user = this.data.collector_name
    }

    this.getMessages()
    this.socket = io(`${environment.SOCKET_LINK}?userName=${this.current_user}`)
    // this.socket.on('message-broadcast', (response: {message: string, userName: string})=>{
    //   if(response){
    //     this.messageList.push({message: response.message, userName: response.userName})
    //     setTimeout(() => {
    //       this.content.scrollToBottom(300);
    //     }, 100);
    //   }
    // })

    this.socket.on('new message', (response: {content: string, sender: string})=>{
      if(response){
        this.messageList.push({message: response.content, userName: response.sender})
        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 100);
      }
    })

    this.socket.emit("join room", this.data._id)
    console.log(this.messageList.length)
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

  async getMessages(){
    await this.talkService.getMessages(this.data._id).subscribe((data)=> {
      for (let i=0;i<data.length;i++){
        this.messageList.push({message: data[i].message, userName: data[i].sender})
      }
      console.log(this.messageList)
    })
  }

  async sendMessage():Promise<void> {
    if(this.message != ''){
      // this.socket.emit('message', this.message);
      await this.talkService.updateMessages(this.data._id, this.message, this.current_user).subscribe()
      this.socket.emit('send-message', {content: this.message, to: this.data._id, sender: this.current_user})
      this.messageList.push({message: this.message, userName: this.current_user})
      console.log(this.messageList)
      this.message = ''
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 100);
      
    }
  }


}
