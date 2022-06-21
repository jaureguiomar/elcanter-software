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

       <FooterElem />
    </div>
</template>

<script>
import Vue from "vue";
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
            order_total: ""
         },
         form: {
            date: "",
            num: ""
         }
      };
   },
   created() {
      this.data.sale_total = this.calculateSaleTotal();
      this.data.order_total = this.calculateOrderTotal();
   },
   methods: {
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

         const vue_this = this;
         Vue.prototype.$http.post("Meseros/reporte_ventas_pedidos", querystring.stringify({
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

<style lang="scss" scoped></style>
