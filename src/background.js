"use strict"

import {
  app, protocol,
  BrowserWindow, dialog,
  ipcMain
} from "electron";
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
])

async function createWindow() {
  let rootDir = app.getAppPath();
  let last = path.basename(rootDir);
  let icon_path = "";

  if(last == "app.asar")
      rootDir = path.dirname(app.getPath("exe"))
  if(isDevelopment)
    icon_path = path.join(__dirname, "src/assets/img/elcanter-icon.ico")
  else
    icon_path = path.join(rootDir, "resources/img/elcanter-icon.ico");

  // Create the browser window.
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    // fullscreen: true,
    icon: icon_path,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js")
    }
  })
  win.removeMenu();
  win.maximize();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()

    autoUpdater.updateConfigPath = path.join(
      __dirname,
      "../dev-app-update.yml" // change path if needed
    );
  } else {
    createProtocol("app")
    // Load the index.html when not in development
    win.loadURL("app://./index.html")
  }

  process.env.GH_TOKEN = "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";
  log.info("Checking for updates...");
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
  autoUpdater.quitAndInstall();
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString())
    }
  }
  createWindow()
})

//////////////////
// Auto Updater //
autoUpdater.on("update-available", () => {
  log.info("update-available");
  dialog.showMessageBox(win, {
    title: "System message",
    buttons: ["Ok"],
    type: "info",
    message: "Update available",
  });
});
autoUpdater.on("update-not-available", () => {
  log.info("update-not-available");
  dialog.showMessageBox(win, {
    title: "System message",
    buttons: ["Ok"],
    type: "info",
    message: "No updates available",
  });
});
autoUpdater.on("download-progress", (progress) => {
  log.info("download-progress");
  log.info("progress", progress);
});
autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  log.info("update-downloaded");

  dialog.showMessageBox({
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "A new version has been downloaded. Restart the application to apply the updates."
  }).then((returnValue) => {
    autoUpdater.quitAndInstall()
    if(returnValue.response === 0)
      autoUpdater.quitAndInstall()
  })
});
autoUpdater.on("error", (message) => {
  log.info("update-error");
  log.info(message);
  console.log("update-error", message);

  dialog.showMessageBox(win, {
    title: "System message",
    buttons: ["Ok"],
    type: "info",
    message: message,
  });
});

///////////////////////////////
// Listen for ipcMain Events //
ipcMain.on("print-table", async function(e, data, cuanto_pago, cambio) {
  let image_path = "";
  if(isDevelopment) {
    image_path = path.join(__dirname, "src/assets/img/elcanter-logo-ticket.png");
  } else {
    let rootDir = app.getAppPath();
    let last = path.basename(rootDir);
    if(last == "app.asar")
        rootDir = path.dirname(app.getPath("exe"))
    image_path = path.join(rootDir, "resources/img/elcanter-logo-ticket.png");
  }

  // Format date properly
  let fecha_final = data["fecha_final"];
  let fecha_result = fecha_final;
  if(fecha_final) {
    let splitted_fecha_final = fecha_final.split("-");
    if(splitted_fecha_final.length == 3) {
      let year = splitted_fecha_final[0];
      let month = splitted_fecha_final[1];
      let day = splitted_fecha_final[2];
      fecha_result = day + "/" + month + "/" + year;
    }
  }

  const device  = new escpos.USB(); // 0x0416, 0x5011
  const options = { encoding: "utf8" }
  const printer = new escpos.Printer(device, options);

  escpos.Image.load(image_path, function(image) {
    device.open(function() {
      printer.size(0, 0);
      printer.align("CT");
      printer.image(image, "s8")
        .then(() => {
          if(fecha_result && data["hora_final"]) {
            printer.text("Fecha");
            printer.text(fecha_result + " " + data["hora_final"]);
            printer.feed();
          }
          printer.text("GUERRERO 25 CENTRO 47980");
          printer.text("DEGOLLADO JALISCO");
          printer.feed();
          printer.text("Mesero");
          printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
          printer.feed();
          printer.text("Id de venta");
          printer.text("#" + data["idventa"]);
          printer.feed();
          printer.text("No de mesa");
          printer.text("#" + data["mesa"]["nomesa"]);
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("CT");
          printer.text("Cantidad - Producto - Precio");
          printer.text("------------------------------");
          printer.align("LT");

          let total = 0;
          for(let i = 0; i < data["comanda"].length; i++) {
            const curr_comanda = data["comanda"][i];
            const curr_subtotal = ((parseFloat(curr_comanda["subtotal_modificado"]) != 0) ? curr_comanda["subtotal_modificado"] : curr_comanda["subtotal"]);
            total += parseFloat(curr_subtotal);

            printer.text(
              curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + " $" + curr_subtotal + " ($" + curr_comanda["precio"] + " c/u)"
            );
            if(i < (data["comanda"].length - 1))
              printer.feed();
          }
          total = total.toFixed(2);

          printer.align("CT")
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("LT")
          printer.tableCustom(
            [
              { text: "Subtotal:", align: "LEFT", width: 0.33 },
              { text: "$" + total, align: "RIGHT", width: 0.33 }
            ]
          );
          printer.tableCustom(
            [
              { text: "Impuestos:", align: "LEFT", width: 0.33 },
              { text: "$0.00", align: "RIGHT", width: 0.33 }
            ]
          );
          printer.align("CT");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("LT");
          printer.tableCustom(
            [
              { text: "Metodo pago:", align: "LEFT", width: 0.33 },
              {
                text: parseInt(data["metodo_pago"] == 1) ? "Efectivo" : parseInt(data["metodo_pago"] == 2) ? "T. de Credito" :  parseInt(data["metodo_pago"]) == 3 ? "T. de Debito" : "Efectivo",
                align: "RIGHT",
                width: 0.33
              }
            ]
          );
          printer.tableCustom(
            [
              { text: "Total pagado:", align: "LEFT", width: 0.33 },
              { text: "$" + ((cuanto_pago) ? cuanto_pago : data["cuanto_pago"]), align: "RIGHT", width: 0.33 }
            ]
          );
          printer.tableCustom(
            [
              { text: "Cambio:", align: "LEFT", width: 0.33 },
              { text: "$" + ((cambio) ? cambio : data["cambio"]), align: "RIGHT", width: 0.33 }
            ]
          );
          printer.align("CT");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.text("GRACIAS POR SU");
          printer.text("COMPRA");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.feed();
          printer.feed();
          printer.cut();
          printer.close();
        });
    });
  });
});

ipcMain.on("print-order", async function(e, data, cuanto_pago, cambio) {
  let image_path = "";
  if(isDevelopment) {
    image_path = path.join(__dirname, "src/assets/img/elcanter-logo-ticket.png");
  } else {
    let rootDir = app.getAppPath();
    let last = path.basename(rootDir);
    if(last == "app.asar")
        rootDir = path.dirname(app.getPath("exe"))
    image_path = path.join(rootDir, "resources/img/elcanter-logo-ticket.png");
  }

  // Format date properly
  let fecha_final = data["fecha_final"];
  let fecha_result = fecha_final;
  if(fecha_final) {
    let splitted_fecha_final = fecha_final.split("-");
    if(splitted_fecha_final.length == 3) {
      let year = splitted_fecha_final[0];
      let month = splitted_fecha_final[1];
      let day = splitted_fecha_final[2];
      fecha_result = day + "/" + month + "/" + year;
    }
  }

  const device  = new escpos.USB(); // 0x0416, 0x5011
  const options = { encoding: "utf8" }
  const printer = new escpos.Printer(device, options);

  escpos.Image.load(image_path, function(image) {
    device.open(function() {
      printer.size(0, 0);
      printer.align("CT");
      printer.image(image, "s8")
        .then(() => {
          if(fecha_result && data["hora_final"]) {
            printer.text("Fecha");
            printer.text(fecha_result + " " + data["hora_final"]);
            printer.feed();
          }
          printer.text("GUERRERO 25 CENTRO 47980");
          printer.text("DEGOLLADO JALISCO");
          printer.feed();
          printer.text("Mesero");
          printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
          printer.feed();
          printer.text("Id del pedido");
          printer.text("#" + data["idpedido"]);
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("CT");
          printer.text("Cantidad - Producto - Precio");
          printer.text("------------------------------");
          printer.align("LT");

          let total = 0;
          for(let i = 0; i < data["comanda"].length; i++) {
            const curr_comanda = data["comanda"][i];
            const curr_subtotal = ((parseFloat(curr_comanda["subtotal_modificado"]) != 0) ? curr_comanda["subtotal_modificado"] : curr_comanda["subtotal"]);
            total += parseFloat(curr_subtotal);

            printer.text(
              curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + " $" + curr_subtotal + " ($" + curr_comanda["precio"] + " c/u)"
            );
            if(i < (data["comanda"].length - 1))
              printer.feed();
          }
          total = total.toFixed(2);

          printer.align("CT");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("LT");
          printer.tableCustom(
            [
              { text: "Subtotal:", align: "LEFT", width: 0.33 },
              { text: "$" + total, align: "RIGHT", width: 0.33 }
            ]
          );
          printer.tableCustom(
            [
              { text: "Impuestos:", align: "LEFT", width: 0.33 },
              { text: "$0.00", align: "RIGHT", width: 0.33 }
            ]
          );
          printer.align("CT");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("LT");
          printer.tableCustom(
            [
              { text: "Metodo pago:", align: "LEFT", width: 0.33 },
              {
                text: parseInt(data["metodo_pago"] == 1) ? "Efectivo" : parseInt(data["metodo_pago"] == 2) ? "T. de Credito" :  parseInt(data["metodo_pago"]) == 3 ? "T. de Debito" : "Efectivo",
                align: "RIGHT",
                width: 0.33
              }
            ]
          );
          printer.tableCustom(
            [
              { text: "Total pagado:", align: "LEFT", width: 0.33 },
              { text: "$" + ((cuanto_pago) ? cuanto_pago : data["cuanto_pago"]), align: "RIGHT", width: 0.33 }
            ]
          );
          printer.tableCustom(
            [
              { text: "Cambio:", align: "LEFT", width: 0.33 },
              { text: "$" + ((cambio) ? cambio : data["cambio"]), align: "RIGHT", width: 0.33 }
            ]
          );
          printer.align("CT");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.text("GRACIAS POR SU");
          printer.text("COMPRA");
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.feed();
          printer.feed();
          printer.cut();
          printer.close();
        });
    });
  });
});
ipcMain.on("print-products-table", async function(e, data) {
  // Format date properly
  let fecha_final = data["fecha_final"];
  let fecha_result = fecha_final;
  if(fecha_final) {
    let splitted_fecha_final = fecha_final.split("-");
    if(splitted_fecha_final.length == 3) {
      let year = splitted_fecha_final[0];
      let month = splitted_fecha_final[1];
      let day = splitted_fecha_final[2];
      fecha_result = day + "/" + month + "/" + year;
    }
  }

  // Split comanda data by category
  let comanda_products = [];
  let comanda_drinks = [];
  for(let i = 0; i < data["comanda"].length; i++) {
      const curr_comanda = data["comanda"][i];
      const curr_producto = curr_comanda["producto"];
      const curr_categoria = curr_producto["categoria"];
      if(curr_categoria["lugar"] == "c")
        comanda_products.push(curr_comanda);
      else if(curr_categoria["lugar"] == "b")
        comanda_drinks.push(curr_comanda);
  }

  // Print "products"
  if(comanda_products.length > 0) {
    const device  = new escpos.USB(); // 0x0416, 0x5011
    const options = { encoding: "utf8" }
    const printer = new escpos.Printer(device, options);

    device.open(function() {
      printer.align("CT");
      printer.size(1, 1);
      printer.align("CT");
      printer.text("Comanda Cocina");
      printer.feed();
      printer.size(0, 0);
      printer.align("CT");
      if(fecha_result && data["hora_final"]) {
        printer.text("Fecha");
        printer.text(fecha_result + " " + data["hora_final"]);
        printer.feed();
      }
      printer.text("Mesero");
      printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
      printer.feed();
      printer.text("No de mesa");
      printer.text("#" + data["mesa"]["nomesa"]);
      printer.text("------------------------------");
      printer.text("------------------------------");
      printer.align("CT");
      printer.text("Cantidad - Descripcion");
      printer.text("------------------------------");
      printer.align("LT");
      for(let i = 0; i < comanda_products.length; i++) {
        const curr_comanda = comanda_products[i];
        printer.text(
          curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + ((curr_comanda["comentario"]) ? " (" + curr_comanda["comentario"] + ")" : "")
        );
        if(i < (comanda_products.length - 1))
          printer.feed();
      }
      printer.feed();
      printer.feed();
      printer.cut();
      printer.close();
    });
  }

  // Print "drinks"
  if(comanda_drinks.length > 0) {
    const device  = new escpos.USB(); // 0x0416, 0x5011
    const options = { encoding: "utf8" }
    const printer = new escpos.Printer(device, options);

    device.open(function() {
      printer.align("CT");
      printer.size(1, 1);
      printer.align("CT");
      printer.text("Comanda Bar");
      printer.feed();
      printer.size(0, 0);
      printer.align("CT");
      if(fecha_result && data["hora_final"]) {
        printer.text("Fecha");
        printer.text(fecha_result + " " + data["hora_final"]);
        printer.feed();
      }
      printer.text("Mesero");
      printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
      printer.feed();
      printer.text("No de mesa");
      printer.text("#" + data["mesa"]["nomesa"]);
      printer.text("------------------------------");
      printer.text("------------------------------");
      printer.align("CT");
      printer.text("Cantidad - Descripcion");
      printer.text("------------------------------");
      printer.align("LT");
      for(let i = 0; i < comanda_drinks.length; i++) {
        const curr_comanda = comanda_drinks[i];
        printer.text(
          curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + ((curr_comanda["comentario"]) ? " (" + curr_comanda["comentario"] + ")" : "")
        );
        if(i < (comanda_drinks.length - 1))
          printer.feed();
      }
      printer.feed();
      printer.feed();
      printer.cut();
      printer.close();
    });
  }
});

ipcMain.on("print-products-order", async function(e, data) {
  // Format date properly
  let fecha_final = data["fecha_final"];
  let fecha_result = fecha_final;
  if(fecha_final) {
    let splitted_fecha_final = fecha_final.split("-");
    if(splitted_fecha_final.length == 3) {
      let year = splitted_fecha_final[0];
      let month = splitted_fecha_final[1];
      let day = splitted_fecha_final[2];
      fecha_result = day + "/" + month + "/" + year;
    }
  }

  // Split comanda data by category
  let comanda_products = [];
  let comanda_drinks = [];
  for(let i = 0; i < data["comanda"].length; i++) {
      const curr_comanda = data["comanda"][i];
      const curr_producto = curr_comanda["producto"];
      const curr_categoria = curr_producto["categoria"];
      if(curr_categoria["lugar"] == "c")
        comanda_products.push(curr_comanda);
      else if(curr_categoria["lugar"] == "b")
        comanda_drinks.push(curr_comanda);
  }

  // Print "products"
  if(comanda_products.length > 0) {
    const device  = new escpos.USB(); // 0x0416, 0x5011
    const options = { encoding: "utf8" }
    const printer = new escpos.Printer(device, options);

    device.open(function() {
      printer.align("CT");
      printer.size(1, 1);
      printer.align("CT");
      printer.text("Comanda Cocina");
      printer.feed();
      printer.size(0, 0);
      printer.align("CT");
      if(fecha_result && data["hora_final"]) {
        printer.text("Fecha");
        printer.text(fecha_result + " " + data["hora_final"]);
        printer.feed();
      }
      printer.text("Mesero");
      printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
      printer.feed();
      printer.text("Id del pedido");
      printer.text("#" + data["idpedido"]);
      printer.text("------------------------------");
      printer.text("------------------------------");
      printer.align("CT");
      printer.text("Cantidad - Descripcion");
      printer.text("------------------------------");
      printer.align("LT");
      for(let i = 0; i < comanda_products.length; i++) {
        const curr_comanda = comanda_products[i];
        printer.text(
          curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + ((curr_comanda["comentario"]) ? " (" + curr_comanda["comentario"] + ")" : "")
        );
        if(i < (comanda_products.length - 1))
          printer.feed();
      }
      printer.feed();
      printer.feed();
      printer.cut();
      printer.close();
    });
  }

  // Print "drinks"
  if(comanda_drinks.length > 0) {
    const device  = new escpos.USB(); // 0x0416, 0x5011
    const options = { encoding: "utf8" }
    const printer = new escpos.Printer(device, options);

    device.open(function() {
      printer.align("CT");
      printer.size(1, 1);
      printer.align("CT");
      printer.text("Comanda Bar");
      printer.feed();
      printer.size(0, 0);
      printer.align("CT");
      if(fecha_result && data["hora_final"]) {
        printer.text("Fecha");
        printer.text(fecha_result + " " + data["hora_final"]);
        printer.feed();
      }
      printer.text("Mesero");
      printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
      printer.feed();
      printer.text("Id del pedido");
      printer.text("#" + data["idpedido"]);
      printer.text("------------------------------");
      printer.text("------------------------------");
      printer.align("CT");
      printer.text("Cantidad - Descripcion");
      printer.text("------------------------------");
      printer.align("LT");
      for(let i = 0; i < comanda_drinks.length; i++) {
        const curr_comanda = comanda_drinks[i];
        printer.text(
          curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + ((curr_comanda["comentario"]) ? " (" + curr_comanda["comentario"] + ")" : "")
        );
        if(i < (comanda_drinks.length - 1))
          printer.feed();
      }
      printer.feed();
      printer.feed();
      printer.cut();
      printer.close();
    });
  }
});

ipcMain.on("print-corte", async function(e, data) {
  const device  = new escpos.USB(); // 0x0416, 0x5011
  const options = { encoding: "utf8" }
  const printer = new escpos.Printer(device, options);

  device.open(function() {
    printer.align("CT");
    printer.size(1, 1);
    printer.align("CT");
    printer.text("Corte de Caja");
    printer.feed();
    printer.size(0, 0);
    printer.align("LT");
    printer.text("Venta de hoy: $" + data["sale_today"]);
    printer.text("Abrio caja: $" + data["start_money"]);
    printer.text("Total en caja: $" + data["total_register"]);
    printer.feed();
    printer.feed();
    printer.cut();
    printer.close();
  });

});
// ipcMain.on("async-message", function(e) {
//   dialog.showErrorBox("System message", "Async message");
//   // Send a message back
//   e.sender.send("async-message-reply", "Main process opened the dialog");
//  });
///////////////////////////////////
///////////////////////////////////

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit()
      }
    })
  } else {
    process.on("SIGTERM", () => {
      app.quit()
    })
  }
}
