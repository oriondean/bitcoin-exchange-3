import * as io from 'socket.io-client';
import {Injectable} from "@angular/core";
import * as Rx from 'rxjs';
import { ISocketUpdate } from './ISocketUpdate';

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect('http://localhost:8081', {transports: ['websocket']});
    }

    emit(subject: string, payload?: any) {
        this.socket.emit(subject, payload);
        return this;
    }

    on<T>(subject: string) {
        return Rx.Observable.create((observer: Rx.Observer<ISocketUpdate<T>>) => {
            this.socket.on(subject, function(type: string, orderAction: any, data: T) {
                if (arguments.length === 2) {
                    observer.next({ type, data: orderAction })
                } else {
                    observer.next({ type, data, orderAction });
                }
            });
        });
    }
}
