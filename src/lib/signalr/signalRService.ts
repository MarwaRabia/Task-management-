/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  public async start(token: string): Promise<void> {
    if (this.connection) {
      console.log('SignalR already connected');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/notificationHub', {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId);
    });

    this.connection.onclose((error) => {
      console.log('SignalR connection closed:', error);
    });

    // Setup event listeners
    this.connection.on('ReceiveNotification', (data) => {
      console.log('Notification received:', data);
      this.notifyListeners('notification', data);
    });

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.listeners.clear();
      console.log('SignalR Disconnected');
    }
  }

  public on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();