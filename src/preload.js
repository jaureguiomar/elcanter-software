const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      let validChannels = ["printer-table", "printer-order"]; // "async-message"
      if(validChannels.includes(channel))
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
      let validChannels = []; // "async-message-reply"
      if(validChannels.includes(channel))
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);
