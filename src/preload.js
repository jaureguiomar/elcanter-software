const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, ...args) => {
      let validChannels = [
        "mysql-data-bakup",
        "print-table", "print-order",
        "print-products-table", "print-products-order",
        "print-corte"
      ];
      if(validChannels.includes(channel))
        ipcRenderer.send(channel, ...args);
    },
    receive: (channel, func) => {
      let validChannels = [
        "initialize-tables-data-reply",
        "mysql-data-bakup-reply"
      ];
      if(validChannels.includes(channel))
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);
