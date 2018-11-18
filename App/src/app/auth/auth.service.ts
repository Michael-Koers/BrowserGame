import { Injectable } from '@angular/core';
import { SocketWrapper } from '../service/socket.wrapper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private socketWrapper: SocketWrapper) { }

  public isAuthenticated(): boolean {

    return (this.socketWrapper.getSocket() != null);
  }
}
