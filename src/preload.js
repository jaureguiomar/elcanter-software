const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      let validChannels = [
        "print-table", "print-order",
        "print-products-table", "print-products-order"
      ];
      if(validChannels.includes(channel))
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
      let validChannels = [];
      if(validChannels.includes(channel))
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);
