import Websocket from 'ws'

class WebscoketHelper {
  constructor() {
    this.webscoket = new Websocket('ws://localhost:3000')
  }

  waitForSocketConnection = async (socket, callback) => {
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if (callback != null) {
            callback();
          }
        } else {
          console.log("wait for connection...")
          waitForSocketConnection(socket, callback);
        }

      }, 5); // wait 5 milisecond for the connection...
  }

  run = async (callback) => {
    await this.waitForSocketConnection(this.webscoket, callback)
    this.webscoket.close();
  }
}

export const websocketHelper = new WebscoketHelper();