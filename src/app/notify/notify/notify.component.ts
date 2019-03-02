import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../Services/notify.service';
import { Message } from '../../Message.model';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  message:Message;

  constructor(
    private notifyService: NotifyService
  ) {
    
    
   }



   newMessageReceived(message: Message) {
    this.message = message 
    console.log(message);

    setTimeout(() => {
      this.message = new Message('', '')
    }, 3500)
 }




  ngOnInit() {
    this.notifyService.newMessageReceived.subscribe(message => this.newMessageReceived(message));
  }

}
