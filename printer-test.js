'use strict';
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const path = require("path");

const device  = new escpos.USB(); // 0x0416, 0x5011
const options = { encoding: "utf8" }
const printer = new escpos.Printer(device, options);
const image_path = path.join(__dirname, "src/assets/img/elcanter-logo-ticket.png");

const json_data = '{"idpedido":"23","hora_inicio":"2022-06-07 03:19:09","fecha_final":"2022-06-07","hora_final":"05:00:00","status":"2","idmesero":"001","total":"3495.00","metodo_pago":"1","idsubapertura":null,"cuanto_pago":"3495.00","cambio":"0.00","mesero":{"idmesero":"001","nombre":"prueba","apellidos":"pruebas","celular":"3333333333","status":"1","fecha":"2021-06-01 07:47:18","status_active":"1"},"comanda":[{"comanda_pedido":"41","idpedido":"23","idproducto":"26","precio":"140.00","cantidad":"2","comentario":"","subtotal":"280.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"26","producto":"AGUACHILE PERICO","precio":"140.00","descripcion":"","favorito":"0","idcategoria":"8","status":"1","status_active":"1"}},{"comanda_pedido":"42","idpedido":"23","idproducto":"27","precio":"65.00","cantidad":"3","comentario":"","subtotal":"195.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"27","producto":"SOPESITOS","precio":"65.00","descripcion":"","favorito":"0","idcategoria":"8","status":"1","status_active":"0"}},{"comanda_pedido":"43","idpedido":"23","idproducto":"28","precio":"75.00","cantidad":"4","comentario":"","subtotal":"300.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"28","producto":"GUACAMOLE","precio":"75.00","descripcion":"","favorito":"0","idcategoria":"8","status":"1","status_active":"1"}},{"comanda_pedido":"44","idpedido":"23","idproducto":"30","precio":"140.00","cantidad":"5","comentario":"","subtotal":"700.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"30","producto":"AGUACHILE MANGO","precio":"140.00","descripcion":"","favorito":"0","idcategoria":"8","status":"1","status_active":"1"}},{"comanda_pedido":"45","idpedido":"23","idproducto":"34","precio":"150.00","cantidad":"6","comentario":"","subtotal":"900.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"34","producto":"CAMARONES AL AJILLO","precio":"150.00","descripcion":"","favorito":"0","idcategoria":"10","status":"1","status_active":"1"}},{"comanda_pedido":"46","idpedido":"23","idproducto":"33","precio":"160.00","cantidad":"7","comentario":"","subtotal":"1120.00","status":"1","status_comanda":"0","subtotal_modificado":"0.00","producto":{"idproducto":"33","producto":"CAMARONES A LA DIABLA","precio":"160.00","descripcion":"","favorito":"0","idcategoria":"10","status":"1","status_active":"1"}}]}';
const data = JSON.parse(json_data);

// Format date properly
let fecha_final = data["fecha_final"]
let splitted_fecha_final = fecha_final.split("-");
let fecha_result = fecha_final;
if(splitted_fecha_final.length == 3) {
  let year = splitted_fecha_final[0];
  let month = splitted_fecha_final[1];
  let day = splitted_fecha_final[2];
  fecha_result = day + "/" + month + "/" + year;
}

// device.open(function() {
//   printer.align("CT");
//   printer.size(1, 1);
//   printer.text("Comanda Cocina");
//   printer.feed();
//   printer.size(0, 0);
//   printer.align("CT");
//   printer.text("Fecha");
//   printer.text(fecha_result + " " + data["hora_final"]);
//   printer.feed(1);
//   printer.text("Mesero");
//   printer.text(data["mesero"]["nombre"] + " " + data["mesero"]["apellidos"]);
//   printer.feed(1);
//   printer.text("Id del pedido");
//   printer.text("#" + data["idpedido"]);
//   printer.text("------------------------------");
//   printer.text("------------------------------");
//   printer.align("CT");
//   printer.text("Cantidad-Descripcion");
//   printer.text("------------------------------");
//   printer.align("LT");
//   for(let i = 0; i < data["comanda"].length; i++) {
//     const curr_comanda = data["comanda"][i];
//     printer.text(
//       curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + ((curr_comanda["comentario"]) ? " (" + curr_comanda["comentario"] + ")" : "")
//     );
//     printer.feed(1);
//   }
//   printer.cut();
//   printer.close();
// });

escpos.Image.load(image_path, function(image) {
  device.open(function() {
    printer.size(0, 0);
    printer.align("CT");
    printer.image(image, "s8")
      .then(() => {
        printer.text("Fecha");
        printer.text(fecha_result + " " + data["hora_final"]);
        printer.feed();
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
        for(let i = 0; i < data["comanda"].length; i++) {
          const curr_comanda = data["comanda"][i];
          printer.text(
            curr_comanda["cantidad"] + ".- " + curr_comanda["producto"]["producto"] + " $" + ((parseFloat(curr_comanda["subtotal_modificado"]) != 0) ? curr_comanda["subtotal_modificado"] : curr_comanda["subtotal"]) + " ($" + curr_comanda["precio"] + " c/u)"
          );
          printer.feed();
        }
        printer.align("CT");
        printer.text("------------------------------");
        printer.text("------------------------------");
        printer.align("LT")
        printer.tableCustom(
          [
            { text: "Subtotal:", align:"LEFT", width: 0.33 },
            { text: "$" + data["total"], align:"RIGHT", width: 0.33 }
          ]
        );
        printer.tableCustom(
          [
            { text: "Impuestos:", align:"LEFT", width: 0.33 },
            { text: "$0.00", align:"RIGHT", width: 0.33 }
          ]
        );
        printer.align("CT");
        printer.text("------------------------------");
        printer.text("------------------------------");
        printer.align("LT");
        printer.tableCustom(
          [
            { text: "Metodo pago:", align:"LEFT", width: 0.33 },
            { text: "Efectivo", align:"RIGHT", width: 0.33 }
          ]
        )
        printer.tableCustom(
          [
            { text: "Total pagado:", align:"LEFT", width: 0.33 },
            { text: "$" + data["total"], align:"RIGHT", width: 0.33 }
          ]
        )
        printer.tableCustom(
          [
            { text: "Cambio:", align:"LEFT", width: 0.33 },
            { text: "$0.00", align:"RIGHT", width: 0.33 }
          ]
        );
        printer.align("CT");
        printer.text("------------------------------");
        printer.text("------------------------------");
        printer.text("GRACIAS POR SU");
        printer.text("COMPRA");
        printer.text("------------------------------");
        printer.text("------------------------------");
        printer.cut();
        printer.close();
      });
  });
});
