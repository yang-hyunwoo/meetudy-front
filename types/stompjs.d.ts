declare module "stompjs" {
  export interface Frame {
    command: string;
    headers: { [key: string]: string };
    body: string;
  }

  export interface IMessage {
    body: string;
    headers: { [key: string]: string };
    ack: () => void;
    nack: () => void;
  }

  export interface Client {
    connect(
      headers: { [key: string]: string },
      connectCallback: (frame: Frame) => void,
      errorCallback?: (error: Frame | string) => void,
    ): void;

    disconnect(
      disconnectCallback?: () => void,
      headers?: { [key: string]: string },
    ): void;

    send(
      destination: string,
      headers?: { [key: string]: string },
      body?: string,
    ): void;

    subscribe(
      destination: string,
      callback: (message: Message) => void,
      headers?: { [key: string]: string },
    ): any;

    unsubscribe(id: string): void;

    connected: boolean;
  }

  export function over(socket: any): Client;
}
