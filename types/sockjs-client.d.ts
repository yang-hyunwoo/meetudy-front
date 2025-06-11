declare module "sockjs-client" {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: any);
    close(): void;
    send(data: any): void;
    onopen: () => void;
    onmessage: (e: { data: any }) => void;
    onclose: () => void;
  }
}
