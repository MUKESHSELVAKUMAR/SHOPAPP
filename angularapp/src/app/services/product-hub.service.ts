import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MsalService } from '@azure/msal-angular';
 
@Injectable({ providedIn: 'root' })
export class ProductHubService {
  private hubConnection!: signalR.HubConnection;
 
  constructor(private msalService: MsalService) {}
 
  async startConnection(): Promise<void> {
    const account = this.msalService.instance.getActiveAccount();
    const tokenResponse = await this.msalService.instance.acquireTokenSilent({
      scopes: ['api://5f4e8beb-3a9d-4a31-8dd3-ffa432445c02/access_as_user'],
      account: account!
    });
 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/products', {
        accessTokenFactory: () => tokenResponse.accessToken
      })
      .withAutomaticReconnect()
      .build();
 
    await this.hubConnection.start();
  }
 
  onProductEvent(callback: (eventType: string, body: string) => void): void {
    this.hubConnection.on('ProductEvent', callback);
  }
}