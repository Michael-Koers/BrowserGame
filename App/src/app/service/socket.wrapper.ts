import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { SocketMessage } from '../models/socket.message';

@Injectable()
export class SocketWrapper {

    private socket: any;
    private uri: string;
    private messages: string[] = [];

    connect(uri: string) {
        if (!this.uri) {
            this.uri = uri;
        }
        let subscriber: Subscriber<string>;
        let observable = new Observable(s => {
            subscriber = s;
        });

        let socket = new WebSocket(uri);
        socket.addEventListener('open', () => console.log('socket open'));
        socket.addEventListener('close', () => console.log('socket gesloten'));
        socket.addEventListener('message', e => {
            subscriber.next(e.data);
        });

        return {
            messages: observable,
            send(message: string) {
                socket.send(message);
            }
        }
    }

    setSocket(socket: any) {
        this.socket = socket;
    }

    getSocket() {
        return this.socket;
    }

    pushSocketMessage(m: any){
        this.messages.push(m);
    }

    getSocketMessages(){
        return this.messages;
    }
}
