"use strict"

import {
  app, protocol,
  BrowserWindow, dialog,
  ipcMain
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import mysql from "mysql";

const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");
const isDevelopment = process.env.NODE_ENV !== "production";
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const mysql_connection = {
  host: "localhost",
  user: "root",
  password: "12345",
  database: "elcanter_sistema",
  port: 3310
};
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
  // win.removeMenu();
  win.maximize();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()

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
ipcMain.on("mysql-data-bakup", function(e, data) {
  const connection = mysql.createConnection(mysql_connection);
  let query = "";

  // Delete data
  query = "delete from sub_apertura";
  connection.query(query);
  query = "delete from apertura";
  connection.query(query);
  query = "delete from clientes";
  connection.query(query);
  query = "delete from usuarios";
  connection.query(query);
  query = "delete from cancelaciones_producto_pedido";
  connection.query(query);
  query = "delete from cancelaciones_producto_venta";
  connection.query(query);
  query = "delete from comandas";
  connection.query(query);
  query = "delete from comandas_pedidos";
  connection.query(query);
  query = "delete from config";
  connection.query(query);
  query = "delete from faltantes";
  connection.query(query);
  query = "delete from listafaltantes";
  connection.query(query);
  query = "delete from pedidos";
  connection.query(query);
  query = "delete from ventas";
  connection.query(query);
  query = "delete from corte";
  connection.query(query);
  query = "delete from mesas";
  connection.query(query);
  query = "delete from meseros";
  connection.query(query);
  query = "delete from productos";
  connection.query(query);
  query = "delete from categoria_productos";
  connection.query(query);
  query = "delete from proveedores";
  connection.query(query);
  query = "delete from reg_pago_provedor";
  connection.query(query);
  query = "delete from tipo_usuario";
  connection.query(query);

  // Reset auto increments
  query = "alter table sub_apertura auto_increment = 1";
  connection.query(query);
  query = "alter table apertura auto_increment = 1";
  connection.query(query);
  query = "alter table clientes auto_increment = 1";
  connection.query(query);
  query = "alter table usuarios auto_increment = 1";
  connection.query(query);
  query = "alter table cancelaciones_producto_pedido auto_increment = 1";
  connection.query(query);
  query = "alter table cancelaciones_producto_venta auto_increment = 1";
  connection.query(query);
  query = "alter table comandas auto_increment = 1";
  connection.query(query);
  query = "alter table comandas_pedidos auto_increment = 1";
  connection.query(query);
  query = "alter table config auto_increment = 1";
  connection.query(query);
  query = "alter table faltantes auto_increment = 1";
  connection.query(query);
  query = "alter table listafaltantes auto_increment = 1";
  connection.query(query);
  query = "alter table pedidos auto_increment = 1";
  connection.query(query);
  query = "alter table ventas auto_increment = 1";
  connection.query(query);
  query = "alter table corte auto_increment = 1";
  connection.query(query);
  query = "alter table mesas auto_increment = 1";
  connection.query(query);
  query = "alter table meseros auto_increment = 1";
  connection.query(query);
  query = "alter table productos auto_increment = 1";
  connection.query(query);
  query = "alter table categoria_productos auto_increment = 1";
  connection.query(query);
  query = "alter table proveedores auto_increment = 1";
  connection.query(query);
  query = "alter table reg_pago_provedor auto_increment = 1";
  connection.query(query);
  query = "alter table tipo_usuario auto_increment = 1";
  connection.query(query);

  // Add categoria_productos
  for(let i = 0; i < data.categoria_poroductos.length; i++) {
    const curr_categoria_producto = data.categoria_poroductos[i];
    query = "";
    query += "insert into categoria_productos set ";
    query += "idcategoria = " + curr_categoria_producto.idcategoria + ", ";
    query += "categoria = '" + curr_categoria_producto.categoria + "', ";
    query += "status = '" + curr_categoria_producto.status + "', ";
    query += "lugar = '" + curr_categoria_producto.lugar + "'";

    connection.query(query, function(error, rows) {
      console.log("#########################");
      console.log("## Categoria Productos ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add productos
  for(let i = 0; i < data.productos.length; i++) {
    const curr_producto = data.productos[i];
    query = "";
    query += "insert into productos set ";
    query += "idproducto = " + curr_producto.idproducto + ", ";
    query += "producto = '" + curr_producto.producto + "', ";
    query += "precio = '" + curr_producto.precio + "', ";
    query += "descripcion = '" + curr_producto.descripcion + "', ";
    query += "favorito = " + curr_producto.favorito + ", ";
    query += "idcategoria = " + curr_producto.idcategoria + ", ";
    query += "status = " + curr_producto.status + ", ";
    query += "status_active = " + curr_producto.status_active;

    connection.query(query, function(error, rows) {
      console.log("###############");
      console.log("## Productos ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add clientes
  for(let i = 0; i < data.clientes.length; i++) {
    const curr_cliente = data.clientes[i];
    query = "";
    query += "insert into clientes set ";
    query += "idcliente = " + curr_cliente.idcliente + ", ";
    query += "nombre = '" + curr_cliente.nombre + "', ";
    query += "status = " + curr_cliente.status;

    connection.query(query, function(error, rows) {
      console.log("##############");
      console.log("## Clientes ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add tipo_usuario
  for(let i = 0; i < data.tipo_usuario.length; i++) {
    const curr_tipo_usuario = data.tipo_usuario[i];
    query = "";
    query += "insert into tipo_usuario set ";
    query += "idtipousuario = '" + curr_tipo_usuario.idtipousuario + "', ";
    query += "tipo = '" + curr_tipo_usuario.tipo + "'";

    connection.query(query, function(error, rows) {
      console.log("##################");
      console.log("## Tipo Usuario ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add usuarios
  for(let i = 0; i < data.usuarios.length; i++) {
    const curr_usuario = data.usuarios[i];
    query = "";
    query += "insert into usuarios set ";
    query += "usuario = '" + curr_usuario.usuario + "', ";
    query += "clave = '" + curr_usuario.clave + "', ";
    query += "nombre = '" + curr_usuario.nombre + "', ";
    query += "tipo = " + curr_usuario.tipo + ", ";
    query += "status = " + curr_usuario.status;

    connection.query(query, function(error, rows) {
      console.log("##############");
      console.log("## Usuarios ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add proveedores
  for(let i = 0; i < data.proveedores.length; i++) {
    const curr_proveedor = data.proveedores[i];
    query = "";
    query += "insert into proveedores set ";
    query += "nombre = '" + curr_proveedor.nombre + "', ";
    query += "status = " + curr_proveedor.status;

    connection.query(query, function(error, rows) {
      console.log("#################");
      console.log("## Proveedores ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add meseros
  for(let i = 0; i < data.meseros.length; i++) {
    const curr_mesero = data.meseros[i];
    query = "";
    query += "insert into meseros set ";
    query += "idmesero = '" + curr_mesero.idmesero + "', ";
    query += "nombre = '" + curr_mesero.nombre + "', ";
    query += "apellidos = '" + curr_mesero.apellidos + "', ";
    query += "celular = '" + curr_mesero.celular + "', ";
    query += "status = " + curr_mesero.status + ", ";
    query += "fecha = '" + curr_mesero.fecha + "', ";
    query += "status_active = " + curr_mesero.status_active;

    connection.query(query, function(error, rows) {
      console.log("#############");
      console.log("## Meseros ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add mesas
  for(let i = 0; i < data.mesas.length; i++) {
    const curr_mesa = data.mesas[i];
    query = "";
    query += "insert into mesas set ";
    query += "idmesa = " + curr_mesa.idmesa + ", ";
    query += "nomesa = " + curr_mesa.nomesa + ", ";
    query += "status = " + curr_mesa.status + ", ";
    query += "croquis = '" + curr_mesa.croquis + "', ";
    query += "imagen = '" + curr_mesa.imagen + "', ";
    query += "imagen_ocupada = '" + curr_mesa.imagen_ocupada + "'";

    connection.query(query, function(error, rows) {
      console.log("###########");
      console.log("## Mesas ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add faltantes
  for(let i = 0; i < data.faltantes.length; i++) {
    const curr_faltante = data.faltantes[i];
    query = "";
    query += "insert into faltantes set ";
    query += "idfaltante = " + curr_faltante.idfaltante + ", ";
    query += "fecha = '" + curr_faltante.fecha + "'";

    connection.query(query, function(error, rows) {
      console.log("################");
      console.log("## Faltantes ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add cortes
  for(let i = 0; i < data.cortes.length; i++) {
    const curr_corte = data.cortes[i];
    query = "";
    query += "insert into corte set ";
    query += "id = " + curr_corte.id + ", ";
    query += "status = " + curr_corte.status + ", ";
    query += "waiter_open = '" + curr_corte.waiter_open + "', ";
    query += "waiter_close = '" + curr_corte.waiter_close + "', ";
    query += "date_close = '" + curr_corte.date_close + "', ";
    query += "amount_start = '" + curr_corte.amount_start + "', ";
    query += "amount_sale = '" + curr_corte.amount_sale + "', ";
    query += "amount_order = '" + curr_corte.amount_order + "', ";
    query += "amount_end = '" + curr_corte.amount_end + "'";

    connection.query(query, function(error, rows) {
      console.log("############");
      console.log("## Cortes ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add ventas
  for(let i = 0; i < data.ventas.length; i++) {
    const curr_venta = data.ventas[i];
    query = "";
    query += "insert into ventas set ";
    query += "idventa = " + curr_venta.idventa + ", ";
    query += "hora_inicio = '" + curr_venta.hora_inicio + "', ";
    query += "fecha_final = '" + curr_venta.fecha_final + "', ";
    query += "hora_final = '" + curr_venta.hora_final + "', ";
    query += "status = " + curr_venta.status + ", ";
    query += "idmesa = " + curr_venta.idmesa + ", ";
    query += "idmesero = '" + curr_venta.idmesero + "', ";
    query += "total = '" + curr_venta.total + "', ";
    query += "metodo_pago = " + curr_venta.metodo_pago + ", ";
    query += "propina = " + curr_venta.propina + ", ";
    query += "monto_propina = '" + curr_venta.monto_propina + "', ";
    query += "porcentaje_propina = '" + curr_venta.porcentaje_propina + "', ";
    query += "personas = " + curr_venta.personas + ", ";
    query += "cuanto_pago = '" + curr_venta.cuanto_pago + "', ";
    query += "cambio = '" + curr_venta.cambio + "', ";
    query += "corte_id = " + curr_venta.corte_id;

    connection.query(query, function(error, rows) {
      console.log("############");
      console.log("## Ventas ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add comandas
  for(let i = 0; i < data.comandas.length; i++) {
    const curr_comanda = data.comandas[i];
    query = "";
    query += "insert into comandas set ";
    query += "comanda = " + curr_comanda.comanda + ", ";
    query += "idventa = " + curr_comanda.idventa + ", ";
    query += "idproducto = " + curr_comanda.idproducto + ", ";
    query += "precio = '" + curr_comanda.precio + "', ";
    query += "cantidad = " + curr_comanda.cantidad + ", ";
    query += "comentario = '" + curr_comanda.comentario + "', ";
    query += "subtotal = '" + curr_comanda.subtotal + "', ";
    query += "status = " + curr_comanda.status + ", ";
    query += "status_comanda = " + curr_comanda.status_comanda + ", ";
    query += "subtotal_modificado = '" + curr_comanda.subtotal_modificado + "'";

    connection.query(query, function(error, rows) {
      console.log("##############");
      console.log("## Comandas ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add pedidos
  for(let i = 0; i < data.pedidos.length; i++) {
    const curr_pedido = data.pedidos[i];
    query = "";
    query += "insert into pedidos set ";
    query += "idpedido = " + curr_pedido.idpedido + ", ";
    query += "hora_inicio = '" + curr_pedido.hora_inicio + "', ";
    query += "fecha_final = '" + curr_pedido.fecha_final + "', ";
    query += "hora_final = '" + curr_pedido.hora_final + "', ";
    query += "status = " + curr_pedido.status + ", ";
    query += "idmesero = '" + curr_pedido.idmesero + "', ";
    query += "total = '" + curr_pedido.total + "', ";
    query += "metodo_pago = " + curr_pedido.metodo_pago + ", ";
    query += "idsubapertura = " + curr_pedido.idsubapertura + ", ";
    query += "cuanto_pago = '" + curr_pedido.cuanto_pago + "', ";
    query += "cambio = '" + curr_pedido.cambio + "', ";
    query += "corte_id = " + curr_pedido.corte_id;

    connection.query(query, function(error, rows) {
      console.log("#############");
      console.log("## Pedidos ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  // Add comandas_pedidos
  for(let i = 0; i < data.comandas_pedidos.length; i++) {
    const curr_comanda_pedido = data.comandas_pedidos[i];
    query = "";
    query += "insert into comandas_pedidos set ";
    query += "comanda_pedido = " + curr_comanda_pedido.comanda_pedido + ", ";
    query += "idpedido = " + curr_comanda_pedido.idpedido + ", ";
    query += "idproducto = " + curr_comanda_pedido.idproducto + ", ";
    query += "precio = '" + curr_comanda_pedido.precio + "', ";
    query += "cantidad = " + curr_comanda_pedido.cantidad + ", ";
    query += "comentario = '" + curr_comanda_pedido.comentario + "', ";
    query += "subtotal = '" + curr_comanda_pedido.subtotal + "', ";
    query += "status = " + curr_comanda_pedido.status + ", ";
    query += "status_comanda = " + curr_comanda_pedido.status_comanda + ", ";
    query += "subtotal_modificado = '" + curr_comanda_pedido.subtotal_modificado + "'";

    connection.query(query, function(error, rows) {
      console.log("######################");
      console.log("## Comandas Pedidos ##");
      console.log("error", error);
      console.log("rows", rows);
    });
  }

  connection.end(function() {
    e.sender.send("mysql-data-bakup-reply");
  });
});

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
          // printer.feed();
          printer.text("Mesero");
          printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
          // printer.feed();
          printer.text("Id de venta");
          printer.text("#" + data["idventa"]);
          // printer.feed();
          printer.text("Mesa");
          printer.text(data["mesa"]["croquis"] + " #" + data["mesa"]["nomesa"]);
          printer.text("------------------------------");
          printer.text("------------------------------");
          printer.align("CT");
          printer.text("Cantidad - Producto - Total");
          printer.text("------------------------------");
          printer.align("LT");

          let total = 0;
          for(let i = 0; i < data["comanda"].length; i++) {
            const curr_comanda = data["comanda"][i];
            const curr_subtotal = ((parseFloat(curr_comanda["subtotal_modificado"]) != 0) ? curr_comanda["subtotal_modificado"] : curr_comanda["subtotal"]);
            total += parseFloat(curr_subtotal);

            printer.text(
              curr_comanda["cantidad"] + ".-" + curr_comanda["producto"]["producto"] + " $" + curr_subtotal
              // curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + " $" + curr_subtotal + " ($" + curr_comanda["precio"] + " c/u)"
            );
            // if(i < (data["comanda"].length - 1))
            //   printer.feed();
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
            // printer.feed();
          }
          printer.text("GUERRERO 25 CENTRO 47980");
          printer.text("DEGOLLADO JALISCO");
          // printer.feed();
          printer.text("Mesero");
          printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
          // printer.feed();
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
              curr_comanda["cantidad"] + ".-" + curr_comanda["producto"]["producto"] + " $" + curr_subtotal
              // curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + " $" + curr_subtotal + " ($" + curr_comanda["precio"] + " c/u)"
            );
            // if(i < (data["comanda"].length - 1))
            //   printer.feed();
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
      printer.text("Mesa");
      printer.text(data["mesa"]["croquis"] + " #" + data["mesa"]["nomesa"]);
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
