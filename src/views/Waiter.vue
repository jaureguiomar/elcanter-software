<template>
   <div>
      <HeaderElem />

       <div class="content-container">
           <div class="content-container-margin">
               <div class="content-container-content">
                  <LeftContentElem>
                     <template #title>
                        <div class="content-title">
                           <div class="content-title-margin">
                              <div class="content-title-content">
                                 <div class="content-title-left">
                                    <h4>Corte meseros</h4>
                                 </div>
                                 <div class="content-title-right">
                                    <button
                                       class="btn btn-custom mr-2"
                                       @click="onOpenCashRegister"
                                    >
                                       <a>
                                          <font-awesome-icon icon="fa-solid fa-store" />
                                          Abrir
                                       </a>
                                    </button>
                                    <button
                                       class="btn btn-custom mr-2"
                                       @click="onCloseCashRegister"
                                    >
                                       <a>
                                          <font-awesome-icon icon="fa-solid fa-store-slash" />
                                          Cerrar
                                       </a>
                                    </button>
                                    <button @click="onDownloadCSV" class="btn btn-custom">
                                       <a href="#">
                                          <font-awesome-icon icon="fa-solid fa-download" />
                                       </a>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </template>

                     <template #content>
                        <div class="waiters-container">
                           <div class="waiters-container-margin">
                              <div class="waiters-container-content">
                                 <div class="waiters-search-container">
                                    <div class="waiters-search-container-margin">
                                       <div class="waiters-search-container-content">
                                          <form>
                                             <div class="form-row align-items-center">
                                                <div class="col-auto">
                                                   <label>Fecha</label>
                                                   <input v-model="form.date" type="date" class="form-control form-control-sm mb-2" placeholder="Seleccione fecha">
                                                </div>
                                                <div class="col-auto">
                                                   <label>ID de mesero</label>
                                                   <div class="input-group mb-2">
                                                      <input v-model="form.num" type="text" class="form-control form-control-sm" placeholder="Ingrese numero">
                                                   </div>
                                                </div>
                                                <div class="col-auto top-11px">
                                                   <button @click="onShowDataClick" class="btn btn-sm btn-custom-orange mb-2">Mostrar</button>
                                                </div>
                                             </div>
                                          </form>
                                       </div>
                                    </div>
                                 </div>
                                 <div class="waiters-content-container">
                                    <div class="waiters-content-container-margin">
                                       <div class="waiters-content-container-content">
                                          <div class="left-container">
                                             <div class="left-container-margin">
                                                <div class="left-container-content">
                                                   <div class="left-container-content-title">
                                                      <h4>Lista de ventas</h4>
                                                   </div>
                                                   <div class="left-container-content-content">
                                                      <table class="table table-hover table-waiters">
                                                         <thead>
                                                            <tr>
                                                               <th>No. de Venta</th>
                                                               <th>Total</th>
                                                            </tr>
                                                         </thead>
                                                         <tbody>
                                                            <tr
                                                               v-for="tmp_sale in data.sale"
                                                               :key="'sale-list-' + tmp_sale.idventa"
                                                            >
                                                               <th>{{ tmp_sale.idventa }}</th>
                                                               <td>${{ tmp_sale.total }}</td>
                                                            </tr>
                                                         </tbody>
                                                         <tfoot>
                                                            <tr>
                                                               <td>Total</td>
                                                               <td>${{ data.sale_total }}</td>
                                                            </tr>
                                                         </tfoot>
                                                      </table>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                          <div class="right-container">
                                             <div class="right-container-margin">
                                                <div class="right-container-content">
                                                   <div class="right-container-content-title">
                                                      <h4>Lista de pedidos</h4>
                                                   </div>
                                                   <div class="right-container-content-content">
                                                      <table class="table table-hover table-waiters">
                                                         <thead>
                                                            <tr>
                                                               <th>No. de Venta</th>
                                                               <th>Total</th>
                                                            </tr>
                                                         </thead>
                                                         <tbody>
                                                            <tr
                                                               v-for="tmp_order in data.order"
                                                               :key="'order-list-' + tmp_order.idpedido"
                                                            >
                                                               <th>{{ tmp_order.idpedido }}</th>
                                                               <td>${{ tmp_order.total }}</td>
                                                            </tr>
                                                         </tbody>
                                                         <tfoot>
                                                            <tr>
                                                               <td>Total</td>
                                                               <td>${{ data.order_total }}</td>
                                                            </tr>
                                                         </tfoot>
                                                      </table>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </template>
                  </LeftContentElem>

                  <RightContentElem>
                     <template #content>
                        <EmptyOkContainerElem />
                     </template>
                  </RightContentElem>
               </div>
           </div>
       </div>

      <b-modal
         ref="open-cash-register-modal"
         title="Mensaje del sistema"
         header-class="modal-header-custom"
         body-class="modal-content-custom"
         content-class="modal-content-custom"
         dialog-class="modal-content-custom"
         footer-class="modal-footer-custom"
      >
         <div class="row text-center">
            <div class="col-md-12">
               <h5>Con cuanto dinero abren la caja?</h5>
               <p style="margin: 0;">Mesero</p>
               <input
                  v-model="data.open_register.waiter_id"
                  type="text"
                  class="form-control-sm"
               >
               <br>
               <br>

               <p style="margin: 0;">Dinero</p>
               <input
                  v-model="data.open_register.start_money"
                  type="text"
                  class="form-control-sm"
                  @blur="onstartMoneyBlur"
                  @keypress="onstartMoneyKeypress"
               >
            </div>
         </div>

         <template #modal-footer>
            <button @click="hideOpenCashRegister" class="btn btn-primary">Cancelar</button>
            <button @click="confirmOpenCashRegister" class="btn btn-warning">Confirmar</button>
         </template>
      </b-modal>
      <b-modal
         ref="close-cash-register-modal"
         title="Mensaje del sistema"
         header-class="modal-header-custom"
         body-class="modal-content-custom"
         content-class="modal-content-custom"
         dialog-class="modal-content-custom"
         footer-class="modal-footer-custom"
      >
         <div class="row text-center">
            <div class="col-md-12">
               <h5>Cerrar caja</h5>
               <p style="margin: 0;">Mesero</p>
               <input
                  v-model="data.close_register.waiter_id"
                  type="text"
                  class="form-control-sm"
               >

               <hr style="border: 1px solid rgb(112, 112, 112) !important">
               <h6>Venta hoy: ${{ data.close_register.sale_today }}</h6>
               <h6>Abrio caja: ${{ data.open_register.start_money }}</h6>
               <br>
               <h6>Total en caja: ${{ data.close_register.total_register }}</h6>
            </div>
         </div>

         <template #modal-footer>
            <button @click="hideCloseCashRegister" class="btn btn-primary">Cancelar</button>
            <button @click="printCloseCashRegister" class="btn btn-primary">Imprimir corte</button>
            <button @click="confirmCloseCashRegister" class="btn btn-warning">Confirmar</button>
         </template>
      </b-modal>

       <FooterElem />
    </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
const querystring = require("querystring");
import compHeader from "@/views/layout/Header.vue";
import compFooter from "@/views/layout/Footer.vue";
import compLeftContent from "@/views/layout/LeftContent.vue";
import compRightContent from "@/views/layout/RightContent.vue";
import compEmptyOkContainer from "@/views/components/shared/EmptyOkContainer.vue";

export default {
   components: {
      HeaderElem: compHeader,
      FooterElem: compFooter,
      LeftContentElem: compLeftContent,
      RightContentElem: compRightContent,
      EmptyOkContainerElem: compEmptyOkContainer,
   },
   data() {
      return {
         data: {
            sale: [],
            order: [],
            sale_total: "",
            order_total: "",
            open_register: {
               start_money: "0.00",
               waiter_id: ""
            },
            close_register: {
               waiter_id: "",
               sale_today: "0.00",
               sale_sale: "0.00",
               sale_order: "0.00",
               total_register: "0.00",
               printer_ticket: false
            }
         },
         form: {
            date: "",
            num: ""
         }
      };
   },
   computed: {
      ...mapGetters([
         "getIsOnline"
      ])
   },
   created() {
      this.data.sale_total = this.calculateSaleTotal();
      this.data.order_total = this.calculateOrderTotal();
   },
   methods: {
      onstartMoneyBlur() {
         if(isNaN(parseFloat(this.data.open_register.start_money)))
            this.data.open_register.start_money = "0.00";
         this.data.open_register.start_money = parseFloat(this.data.open_register.start_money).toFixed(2);
      },
      onstartMoneyKeypress(e) {
         if(e.which == 13) {
            if(isNaN(parseFloat(this.data.open_register.start_money)))
               this.data.open_register.start_money = "0.00";
            this.data.open_register.start_money = parseFloat(this.data.open_register.start_money).toFixed(2);
         }
      },
      hideOpenCashRegister() {
         this.$refs["open-cash-register-modal"].hide();
      },
      confirmOpenCashRegister() {
         if(parseFloat(this.data.open_register.start_money) <= 0 || !this.data.open_register.waiter_id) {
            this.$fire({
               title: "Error",
               text: "Debe ingresar datos validos para iniciar el corte",
               type: "error"
            });
            return;
         }

         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         const vue_this = this;
         http.post("Cortes/insert",
            querystring.stringify({
               waiter_open: this.data.open_register.waiter_id,
               amount_start: this.data.open_register.start_money
            }),
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         )
         .then(function (response) {
               if(response) {
                  // const data = response.data;
                  vue_this.data.open_register.start_money = "0.00";
                  vue_this.data.open_register.waiter_id = "";
                  vue_this.$refs["open-cash-register-modal"].hide();
                  vue_this.$fire({
                     title: "Ok",
                     text: "Corte iniciado",
                     type: "success"
                  });
               } else {
                  this.$fire({
                     title: "Error",
                     text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                     type: "error"
                  });
               }
            });
      },
      onOpenCashRegister() {
         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         // Check if therers an open "corte"
         const vue_this = this;
         http.post("Cortes/get_last", {},
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         )
         .then(function (response) {
               const data = response.data;
               if(!data) {
                  vue_this.$refs["open-cash-register-modal"].show();
               } else {
                  if(data["status"] == 1) {
                     vue_this.$fire({
                        title: "Error",
                        text: "Ya existe un corte abierto!",
                        type: "error"
                     });
                  } else {
                     vue_this.$refs["open-cash-register-modal"].show();
                  }
               }
            });
      },
      hideCloseCashRegister() {
         this.$refs["close-cash-register-modal"].hide();
      },
      printCloseCashRegister() {
         this.data.close_register.printer_ticket = true;
         window.api.send("print-corte", {
            sale_today: this.data.close_register.sale_today,
            start_money: this.data.open_register.start_money,
            total_register: this.data.close_register.total_register
         });
      },
      async confirmCloseCashRegister() {
         if(!this.data.close_register.printer_ticket) {
            this.$fire({
               title: "Error",
               text: "No has impreso el ticket del corte!",
               type: "error"
            });
            return;
         }

         if(!this.data.close_register.waiter_id) {
            this.$fire({
               title: "Error",
               text: "Debe ingresar datos validos para cerrar el corte",
               type: "error"
            });
            return;
         }

         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         // Get last valid "corte"
         let response = null;
         let last_corte = null;
         response = await http.post("Cortes/get_last", {},
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         );
         if(response) {
            const data = response.data;
            last_corte = data;
            if(!last_corte) {
               this.$fire({
                  title: "Error",
                  text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                  type: "error"
               });
               return;
            } else {
               if(last_corte["status"] == 2) {
                  this.$fire({
                     title: "Error",
                     text: "No hay corte abierto",
                     type: "error"
                  });
               }
            }
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return;
         }

         if(last_corte) {
            last_corte["status"] = 2;
            last_corte["waiter_close"] = this.data.close_register.waiter_id;
            last_corte["date_close"] = new Date();
            last_corte["amount_sale"] = this.data.close_register.sale_sale;
            last_corte["amount_order"] = this.data.close_register.sale_order;
            last_corte["amount_end"] = this.data.close_register.sale_today;

            let http = null;
            if(this.getIsOnline)
               http = Vue.prototype.$http;
            else
               http = Vue.prototype.$httpLocal;

            // Get update "corte"
            let response = null;
            response = await http.post("Cortes/update/" + last_corte["id"], querystring.stringify({
               corte: JSON.stringify(last_corte)
            }),
               {
                  responseType: "text",
                  headers: {
                     "X-Requested-With": "XMLHttpRequest",
                     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                  }
               }
            );
            if(response) {
               const data = response.data;
               if(data == 1) {
                  this.$refs["close-cash-register-modal"].hide();
                  this.$fire({
                     title: "Ok",
                     text: "Corte cerrado",
                     type: "success"
                  });
               } else {
                  this.$fire({
                     title: "Error",
                     text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                     type: "error"
                  });
                  return;
               }
            } else {
               this.$fire({
                  title: "Error",
                  text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                  type: "error"
               });
               return;
            }
         }
      },
      async onCloseCashRegister() {
         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         ////////////////////////////
         // Get last valid "corte" //
         let response = null;
         let last_corte = null;
         response = await http.post("Cortes/get_last", {},
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         );
         if(response) {
            const data = response.data;
            last_corte = data;
            if(data) {
               if(data["status"] == 2) {
                  this.$fire({
                     title: "Error",
                     text: "No hay corte abierto",
                     type: "error"
                  });
                  return;
               }
            } else {
               this.$fire({
                  title: "Error",
                  text: "No hay corte abierto",
                  type: "error"
               });
               return;
            }
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return;
         }

         //////////////////////////////
         // Get ALL sales by "corte" //
         response = null;
         let sales_by_corte = null;
         response = await http.post("Ventas/get_sales_by_corte/" + last_corte["id"], {},
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         );
         if(response) {
            const data = response.data;
            sales_by_corte = data;
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return;
         }

         //////////////////////////////
         // Get ALL orders by "corte" //
         response = null;
         let orders_by_corte = null;
         response = await http.post("Pedidos/get_orders_by_corte/" + last_corte["id"], {},
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         );
         if(response) {
            const data = response.data;
            orders_by_corte = data;
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return;
         }

         ////////////////////////////////
         // Recalculate End of "corte" //
         let total_sale = 0;
         let total_order = 0;
         let total = 0;
         let pending_sale = false;
         let pending_order = false;

         for(let i = 0; i < sales_by_corte.length; i++) {
            const curr_sale = sales_by_corte[i];
            const how_many = parseFloat(curr_sale["cuanto_pago"]);
            const change = parseFloat(curr_sale["cambio"]);
            const status = curr_sale["status"];
            total_sale += how_many - change;
            if(status == 1) {
               pending_sale = true;
               break;
            }
         }

         for(let i = 0; i < orders_by_corte.length; i++) {
            const curr_order = orders_by_corte[i];
            const how_many = parseFloat(curr_order["cuanto_pago"]);
            const change = parseFloat(curr_order["cambio"]);
            const status = curr_order["status"];
            total_order += how_many - change;
            if(status == 1) {
               pending_order = true;
               break;
            }
         }
         total = parseFloat(total_sale + total_order).toFixed(2);
         total_sale = parseFloat(total_sale).toFixed(2);
         total_order = parseFloat(total_order).toFixed(2);

         // Check if pending sales/orders
         if(!pending_sale && !pending_order) {
            this.data.close_register.sale_today = total;
            this.data.close_register.sale_sale = total_sale;
            this.data.close_register.sale_order = total_order;
            this.data.close_register.total_register = (parseFloat(total) + parseFloat(last_corte["amount_start"])).toFixed(2);
            this.data.open_register.start_money = last_corte["amount_start"];
            this.data.close_register.printer_ticket = false;
            this.$refs["close-cash-register-modal"].show();
         } else {
            this.$fire({
               title: "Error",
               text: "No es posible cerrar caja. Aun hay ventas o pedidos pendientes",
               type: "error"
            });
         }
      },
      onDownloadCSV() {
         let file_date = "";
         let file_data = "";

         file_date = this.getFileDate();

         // Sales
         file_data = "Id Venta, Mesa, Id Mesero, Mesero, Total, Pago, Metodo Pago, Hora Inicio, Hora Final\n";
         for(let i = 0; i < this.data.sale.length; i++) {
            const curr_sale = this.data.sale[i];
            file_data += `${ curr_sale.idventa }, ${ curr_sale.mesa.croquis }, ${ curr_sale.idmesero }, ${ curr_sale.mesero.nombre + ' ' + curr_sale.mesero.apellidos }, ${ curr_sale.total }, $${ curr_sale.cuanto_pago }, ${ (curr_sale.metodo_pago == 1) ? 'Efectivo' : (curr_sale.metodo_pago == 2) ? 'T. de Credito' : (curr_sale.metodo_pago == 3) ? 'T. de Credito' : 'Desconocido' }, ${ (curr_sale.hora_inicio) ? curr_sale.hora_final : "" }`;
            file_data += "\n";
         }

         // Orders
         file_data += "\n";
         file_data += "Id Pedido, Id Mesero, Mesero, Estatus, Total, Hora Inicio, Hora Final\n";
         for(let i = 0; i < this.data.order.length; i++) {
            const curr_order = this.data.order[i];
            file_data += `${ curr_order.idpedido }, ${ curr_order.idmesero }, ${ curr_order.mesero.nombre + ' ' + curr_order.mesero.apellidos }, ${ curr_order.status }, $${ curr_order.total }, ${ curr_order.hora_inicio }, ${ (curr_order.hora_final) ? curr_order.hora_final : "" }`;
            if(i <= this.data.order.length)
               file_data += "\n";
         }

         const anchor = document.createElement("a");
         anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(file_data);
         anchor.target = "_blank";
         anchor.download = "ventas-pedidos-reporte" + file_date + ".csv";
         anchor.click();
         anchor.remove();
      },
      onShowDataClick(e) {
         e.preventDefault();
         const date = this.form.date;
         const num = this.form.num;

         if(!date || !num) {
            this.$fire({
               title: "Error",
               text: "Debe ingresar los datos para consultar informacion",
               type: "error"
            });
            return;
         }

         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         const vue_this = this;
         http.post("Meseros/reporte_ventas_pedidos", querystring.stringify({
            fecha_mesero: date,
            mesero_uuid: num
         }),
         {
            responseType: "text",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         })
         .then(function (response) {
               if(response) {
                  const data = response.data;
                  vue_this.data.sale = data.ventas;
                  vue_this.data.order = data.pedidos;
                  vue_this.data.sale_total = vue_this.calculateSaleTotal();
                  vue_this.data.order_total = vue_this.calculateOrderTotal();
               } else {
                  this.$fire({
                     title: "Error",
                     text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                     type: "error"
                  });
               }
            });
      },
      ///////////////
      // Functions //
      calculateSaleTotal() {
         let total = 0;
         if(this.data.sale) {
            for(let i = 0; i < this.data.sale.length; i++) {
               const curr_sale = this.data.sale[i];
               const curr_total = parseFloat(curr_sale.total).toFixed(2);
               total += parseFloat(curr_total);
            }
         }

         if(isNaN(total))
            total = -1;
         else
            total = total.toFixed(2);
         return total;
      },
      calculateOrderTotal() {
         let total = 0;
         if(this.data.order) {
            for(let i = 0; i < this.data.order.length; i++) {
               const curr_order = this.data.order[i];
               const curr_total = parseFloat(curr_order.total).toFixed(2);
               total += parseFloat(curr_total);
            }
         }

         if(isNaN(total))
            total = -1;
         else
            total = total.toFixed(2);
         return total;
      },
      getFileDate() {
         const now = new Date();
         let day = now.getDate();
         let month = now.getMonth() + 1;
         let year = now.getFullYear();

         if(day < 10)
            day = "0" + day;
         if(month < 10)
            month = "0" + month;

         return day + month + year;
      }
   }
};
</script>

<style lang="scss">
.modal-content-custom {
   background: rgb(52, 50, 49) !important;
}
.modal-header-custom {
   border-bottom: 1px solid rgb(112, 112, 112) !important;
}
.modal-footer-custom {
   border-top: 1px solid rgb(112, 112, 112) !important;
}
</style>
