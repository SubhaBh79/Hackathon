import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Http } from '@angular/http';
import { ApiAiClient } from 'api-ai-javascript';
import { AudioService } from './chat/audio.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { url } from 'inspector';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogFlow.clientToken;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private _http : Http,private _audioService : AudioService) {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    //this.client.eventRequest("try")
        
    let url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyAbC0oNqmTseoGWa8MA2TapixOoZxHyofU";


    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  let body = {
                    "voice": {
                     "languageCode": "en_US",
                     "ssmlGender": "female"
                    },
                    "input": {
                     "text": speech
                    },
                    "audioConfig": {
                     "audioEncoding": "Mp3"
                    }
                   };
                  this._http.post(url,JSON.stringify(body)).subscribe(data=>{
                    console.log(data);
                    this._audioService.playAudio(this._base64ToArrayBuffer(data.json().audioContent));
                    this.update(botMessage);
                  });
                  
               });
  }

  private _base64ToArrayBuffer(base64){
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }



  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }
}