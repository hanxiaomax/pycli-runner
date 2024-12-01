// WebSocketClient.ts
class WebSocketClient {
  private socket: WebSocket | null = null;
  private onMessageCallback: (message: string) => void = () => {};
  private onErrorCallback: (error: string) => void = () => {};
  private onOpenCallback: () => void = () => {};
  private onCloseCallback: () => void = () => {};

  // Initialize WebSocket connection
  public init(url: string) {
    if (this.socket) return; // Prevent initializing multiple connections

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connection established");
      this.onOpenCallback();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("Message received: ", event.data);
      this.onMessageCallback(event.data); // Trigger the message callback
    };

    this.socket.onerror = (event: Event) => {
      console.error("WebSocket error: ", event);
      this.onErrorCallback("WebSocket error occurred");
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
      this.onCloseCallback();
    };
  }

  // Send a message to the WebSocket server
  public sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log("Sent message: ", message);
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Set the callback for handling messages
  public onMessage(callback: (message: string) => void) {
    this.onMessageCallback = callback;
  }

  // Set the callback for handling errors
  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  // Set the callback for when the connection is opened
  public onOpen(callback: () => void) {
    this.onOpenCallback = callback;
  }

  // Set the callback for when the connection is closed
  public onClose(callback: () => void) {
    this.onCloseCallback = callback;
  }

  // Close the WebSocket connection manually
  public close() {
    if (this.socket) {
      this.socket.close();
      console.log("WebSocket connection manually closed");
    }
  }
}

export default WebSocketClient;
