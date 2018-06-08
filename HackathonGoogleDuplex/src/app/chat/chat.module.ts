import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { AudioService } from './audio.service';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';

@NgModule({
  imports: [
    CommonModule,
  FormsModule,
  HttpModule
  ],
  declarations: [ChatDialogComponent],
  exports : [ChatDialogComponent],
  providers : [ChatService,AudioService]
})
export class ChatModule { }
