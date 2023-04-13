import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  @Input() notifMessage: string;
  @Input() notifDatetime: string;
  @Input() notifSuccess: string;
  @Input() notifAlert: string;
  @Input() notifWarning: string; 
  @Input() status:string;
  icon_name: string
  icon_color: string
  constructor() { }

  ngOnInit() {
    if (this.status == "success"){
      this.icon_name = "checkmark-circle-outline"
      this.icon_color = "success"
    }
    if (this.status == "warning"){
      this.icon_name = "warning-outline"
      this.icon_color = "warning"
    }
    if (this.status == "cancel"){
      this.icon_name = "alert-circle-outline"
      this.icon_color = "danger"
    }
  }

}
