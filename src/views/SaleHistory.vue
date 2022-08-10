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
                                    <h4>Historial</h4>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </template>

                     <template #content>
                        <div class="sale-history-container">
                           <div class="sale-history-container-margin">
                              <div class="sale-history-container-content">
                                 <div class="sale-history-content-container">
                                    <div class="sale-history-content-container-margin">
                                       <div class="sale-history-content-container-content">
                                          <div class="left-container">
                                             <div class="left-container-margin">
                                                <div class="left-container-content">
                                                   <div class="left-container-content-title">
                                                      <h4>Historial de ventas</h4>
                                                   </div>
                                                   <div class="left-container-content-content">
                                                      <div v-if="data.sale.length <= 0" class="text-center">
                                                          <font-awesome-icon class="mb-2" icon="fa-solid fa-database" size="3x" />
                                                          <h6>Por el momento no hay informacion para mostrar...</h6>
                                                      </div>
                                                      <table v-else class="table table-hover">
                                                         <thead>
                                                            <tr>
                                                               <th>No. de Venta</th>
                                                               <th>Mesero</th>
                                                               <th>Fecha cierre</th>
                                                            </tr>
                                                         </thead>
                                                         <tbody>
                                                            <tr
                                                               v-for="tmp_sale in data.sale"
                                                               :key="'sale-list-' + tmp_sale.idventa"
                                                            >
                                                               <th>{{ tmp_sale.idventa }}</th>
                                                               <td>{{ tmp_sale.mesero.nombre + " " + tmp_sale.mesero.apellidos }}</td>
                                                               <td>{{ tmp_sale.fecha_final + " " + tmp_sale.hora_final }}</td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                          <div class="right-container">
                                             <div class="right-container-margin">
                                                <div class="right-container-content">
                                                   <div class="right-container-content-title">
                                                      <h4>Historial de pedidos</h4>
                                                   </div>
                                                   <div class="right-container-content-content">
                                                      <div v-if="data.order.length <= 0" class="text-center">
                                                          <font-awesome-icon class="mb-2" icon="fa-solid fa-database" size="3x" />
                                                          <h6>Por el momento no hay informacion para mostrar...</h6>
                                                      </div>
                                                      <table v-else class="table table-hover">
                                                         <thead>
                                                            <tr>
                                                               <th>No. de Venta</th>
                                                               <th>Mesero</th>
                                                               <th>Fecha cierre</th>
                                                            </tr>
                                                         </thead>
                                                         <tbody>
                                                            <tr
                                                               v-for="tmp_order in data.order"
                                                               :key="'order-list-' + tmp_order.idpedido"
                                                            >
                                                               <th>{{ tmp_order.idpedido }}</th>
                                                               <td>{{ tmp_order.mesero.nombre + " " + tmp_order.mesero.apellidos }}</td>
                                                               <td>{{ tmp_order.fecha_final + " " + tmp_order.hora_final }}</td>
                                                            </tr>
                                                         </tbody>
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

                     <template #footer>
                           <div class="content-footer">
                              <div class="content-footer-margin">
                                 <div class="content-footer-content">
                                    <div class="left-content">
                                       <p>Mostrando registros del 1 al 10 de un total de 30 registros</p>
                                    </div>
                                    <div class="right-content">
                                       <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                          <div class="btn-group mr-2" role="group" aria-label="First group">
                                             <button type="button" class="btn btn-custom">1</button>
                                             <button type="button" class="btn btn-custom">2</button>
                                             <button type="button" class="btn btn-custom">3</button>
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
import { mapGetters } from "vuex";
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
            order: []
         }
      };
   },
   computed: {
      ...mapGetters([
         "getIsOnline"
      ])
   },
   created() {
      let http = null;
      if(this.getIsOnline)
         http = Vue.prototype.$http;
      else
         http = Vue.prototype.$httpLocal;

      const vue_this = this;
      http.get("Rutes/venta_historial", {}, {
         responseType: "text",
         headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
         }
      })
      .then(function (response) {
            if(response) {
               const data = response.data;
               vue_this.data.sale = data.ventas_historial;
               vue_this.data.order = data.pedidos_historial;
            } else {
               this.$fire({
                  title: "Error",
                  text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                  type: "error"
               });
            }
         });
   }
};
</script>

<style lang="scss" scoped></style>
