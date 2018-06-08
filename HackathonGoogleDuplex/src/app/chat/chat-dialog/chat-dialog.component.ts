import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../../chat.service';
import { AudioService } from '../audio.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import SpeechToText from 'speech-to-text';

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  isListening : boolean=false;

  constructor(public chat: ChatService,private _audio : AudioService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );
  }

  sendMessage() {
    this._audio.listenAudio();
    try {
      const listener = new SpeechToText((text)=>{
        console.log(text);
      }, (text)=>{
        console.log("Final");
        console.log(text);
        this.isListening = false;
        this.chat.converse(text);
      });
      this.isListening = true;
      listener.startListening();
    } catch (error) {
      console.log(error);
    }
    //this.chat.converse(this.formValue);
    this.formValue = '';
  }

}