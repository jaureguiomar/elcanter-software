<template>
   <div>
      <HeaderElem />

       <div class="content-container">
           <div class="content-container-margin">
               <div class="content-container-content">
                  <LeftContentElem>
                     <template #title>
                        <div class="content-title-content">
                            <div class="content-title-left">
                                <h4>Pedidos</h4>
                            </div>
                            <div class="content-title-right">
                                <button
                                    @click="onNewOrderClick"
                                    class="btn btn-custom mr-2">
                                    <a>
                                        <font-awesome-icon icon="fa-solid fa-plus" />
                                        Nuevo pedido
                                    </a>
                                </button>
                                <button
                                 @click="onDownloadCSV"
                                 class="btn btn-custom">
                                    <a>
                                        <font-awesome-icon icon="fa-solid fa-download" />
                                    </a>
                                </button>
                            </div>
                        </div>
                     </template>

                     <template #content>
                        <div class="orders-container">
                           <div class="orders-container-margin">
                              <div class="orders-container-content">
                                 <!-- <div class="orders-top-container">
                                     <div class="orders-top-container-margin">
                                         <div class="orders-top-container-content">
                                             <div class="left-container">
                                                 <p>Mostrar</p>
                                                 <select class="form-control form-control-sm">
                                                     <option value="10">10</option>
                                                     <option value="25">25</option>
                                                     <option value="50">50</option>
                                                     <option value="100">100</option>
                                                 </select>
                                                 <p>registros</p>
                                             </div>
                                             <div class="right-container">
                                                 <p>Buscar:</p>
                                                 <input type="text" class="form-control form-control-sm">
                                             </div>
                                         </div>
                                     </div>
                                 </div> -->
                                 <!-- <div class="container-content-top">
                                    <div class="container-content-top-margin">
                                       <div class="container-content-top-content">
                                       <button class="btn btn-custom-white">
                                          <a href="#">
                                             <i class="fa fa-search" aria-hidden="true"></i>
                                             Buscar pedido
                                          </a>
                                       </button>
                                       </div>
                                    </div>
                                 </div> -->

                                 <div class="container-content-content">
                                    <div class="container-content-content-margin">
                                       <div class="container-content-content-content">
                                          <b-row align-h="end">
                                             <b-col lg="7" class="mb-2">
                                                <b-form-group
                                                   label="Filtrar"
                                                   label-for="filter-input"
                                                   label-cols-sm="3"
                                                   label-align-sm="right"
                                                   label-size="sm"
                                                   class="mb-0"
                                                >
                                                   <b-input-group size="sm">
                                                      <b-form-input
                                                         id="filter-input"
                                                         v-model="table.filter"
                                                         type="search"
                                                         placeholder="Buscar..."
                                                      >
                                                      </b-form-input>

                                                      <b-input-group-append>
                                                         <b-button :disabled="!table.filter" @click="table.filter=''">Limpiar</b-button>
                                                      </b-input-group-append>
                                                   </b-input-group>
                                                </b-form-group>
                                             </b-col>
                                             <b-col sm="5" md="5" class="mb-2">
                                                <b-form-select
                                                   id="per-page-select"
                                                   v-model="table.perPage"
                                                   :options="table.pageOptions"
                                                   size="sm"
                                                >
                                                </b-form-select>
                                             </b-col>
                                          </b-row>

                                          <b-table
                                             :items="data.order"
                                             :fields="table.fields"
                                             :current-page="table.currentPage"
                                             :per-page="table.perPage"
                                             :filter="table.filter"
                                             :filter-included-fields="table.filterOn"
                                             :sort-by.sync="table.sortBy"
                                             :sort-desc.sync="table.sortDesc"
                                             :sort-direction="table.sortDirection"
                                             stacked="md"
                                             show-empty
                                             empty-text="No hay registros disponibles para mostrar"
                                             empty-filtered-text="No hay registros disponibles para mostrar"
                                             small
                                             @filtered="onFiltered"
                                             selectable
                                             ref="selectableTable"
                                             :select-mode="'single'"
                                             @row-selected="onOrderRowClick"
                                          >
                                             <template #cell(name)="row">
                                                {{ row.value.first }} {{ row.value.last }}
                                             </template>

                                             <template #cell(actions)="row">
                                                <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                                                   Info modal
                                                </b-button>
                                                <b-button size="sm" @click="row.toggleDetails">
                                                   {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                                                </b-button>
                                             </template>

                                             <template #row-details="row">
                                                <b-card>
                                                   <ul>
                                                      <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                                                   </ul>
                                                </b-card>
                                             </template>
                                          </b-table>
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
                                 <b-col sm="12" md="12" class="my-1">
                                    <b-pagination
                                       v-model="table.currentPage"
                                       :total-rows="table.totalRows"
                                       :per-page="table.perPage"
                                       align="right"
                                       size="sm"
                                       class="my-0 customPagination"
                                    >
                                    </b-pagination>
                                 </b-col>
                                 <!-- <div class="left-content">
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
                                 </div> -->
                              </div>
                           </div>
                        </div>
                     </template>
                  </LeftContentElem>

                  <RightContentElem>
                     <template #content>
                        <EmptyOkContainerElem
                           v-if="table.selected <= 0 && !data.new_order"
                        />
                        <FormContainerElem
                           @addOrder="addOrder"
                           v-if="table.selected <= 0 && data.new_order"
                        />
                        <TotalContainerElem
                           v-if="table.selected > 0 && !data.new_order"
                           :data="data.curr_order"
                           type="order"
                           @updateOrder="updateOrder"
                           @updateOrderField="updateOrderField"
                           @updateOrderComandaField="updateOrderComandaField"
                           @removeOrderComanda="removeOrderComanda"
                        />
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
import compHeader from "@/views/layout/Header.vue";
import compFooter from "@/views/layout/Footer.vue";
import compLeftContent from "@/views/layout/LeftContent.vue";
import compRightContent from "@/views/layout/RightContent.vue";
import compEmptyOkContainer from "@/views/components/shared/EmptyOkContainer.vue";
import compFormContainer from "@/views/components/order/FormContainer.vue";
import compTotalContainer from "@/views/components/shared/TotalContainer.vue";

export default {
   components: {
      HeaderElem: compHeader,
      FooterElem: compFooter,
      LeftContentElem: compLeftContent,
      RightContentElem: compRightContent,
      EmptyOkContainerElem: compEmptyOkContainer,
      FormContainerElem: compFormContainer,
      TotalContainerElem: compTotalContainer
   },
   data() {
      return {
         data: {
            order: [],
            curr_order: {},
            curr_order_index: -1,
            new_order: false
         },
         table: {
            selected: -1,
            fields: [
               { key: "idpedido", label: "No. de Pedido", sortable: true, sortDirection: "desc", class: "text-center" },
               {
                  key: "mesero",
                  label: "Mesero",
                  sortable: true,
                  sortByFormatted: true,
                  filterByFormatted: true,
                  class: "text-center",
                  formatter: (mesero) => {
                     return mesero.nombre + " " + mesero.apellidos;
                  }
               },
               { key: "status", label: "Status", sortable: true, class: "text-center" },
               {
                  key: "total",
                  label: "Total",
                  sortable: false,
                  sortByFormatted: true,
                  filterByFormatted: true,
                  class: "text-center",
                  formatter: (total) => {
                     return "$" + total;
                  }
               }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
            pageOptions: [
               5, 10, 15,
               { value: 100, text: "Mostrar todo" }
            ],
            sortBy: "idpedido",
            sortDesc: true,
            sortDirection: "desc",
            filter: null,
            filterOn: []
         }
      };
   },
   created() {
      const vue_this = this;
      Vue.prototype.$http.get("Rutes/venta_pedidos")
         .then(function (response) {
            if(response) {
               const data = response.data;
               vue_this.data.order = data;
               vue_this.table.totalRows = vue_this.data.order.length;
            } else {
               this.$fire({
                  title: "Error",
                  text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                  type: "error"
               });
            }
         });
   },
   methods: {
      async onNewOrderClick() {
         //////////////////////////////
         // Validate if "corte" open //
         // Get last valid "corte"
         let response = null;
         let last_corte = null;
         response = await Vue.prototype.$http.post("Cortes/get_last", {},
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
                     text: "Debes iniciar corte antes de realizar pedidos",
                     type: "error"
                  });
                  return;
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
         //////////////////////////////
         //////////////////////////////

         this.data.new_order = true;
         this.table.selected = -1;
      },
      onDownloadCSV() {
         let file_date = "";
         let file_data = "";

         file_date = this.getFileDate();
         file_data = "Id Pedido, Id Mesero, Mesero, Estatus, Total, Hora Inicio, Hora Final\n";

         for(let i = 0; i < this.data.order.length; i++) {
            const curr_order = this.data.order[i];
            file_data += `${ curr_order.idpedido }, ${ curr_order.idmesero }, ${ curr_order.mesero.nombre + ' ' + curr_order.mesero.apellidos }, ${ curr_order.status }, $${ curr_order.total }, ${ curr_order.hora_inicio }, ${ (curr_order.hora_final) ? curr_order.hora_final : "" }`;
            if(i <= this.data.order.length)
               file_data += "\n";
         }

         const anchor = document.createElement("a");
         anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(file_data);
         anchor.target = "_blank";
         anchor.download = "pedidos-reporte" + file_date + ".csv";
         anchor.click();
         anchor.remove();
      },
      onOrderRowClick(selected_order) {
         // if(this.table.selected == selected_order.idpedido)
         //    return;

         if(selected_order.length > 0) {
            let index = -1;
            selected_order = selected_order[0];

            for(let i = 0; i < this.data.order.length; i++) {
               const curr_oder = this.data.order[i];
               if(selected_order.idpedido == curr_oder.idpedido) {
                  index = i;
                  break;
               }
            }

            this.data.new_order = false;
            this.table.selected = selected_order.idpedido;

            const vue_this = this;
            Vue.prototype.$http.post("Pedidos/get_by_id/" + this.table.selected)
               .then(function (response) {
                  if(response) {
                     const data = response.data;
                     vue_this.data.curr_order = data;
                     vue_this.data.curr_order_index = index;
                  } else {
                     this.$fire({
                        title: "Error",
                        text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                        type: "error"
                     });
                  }
               });
         } else {
            this.data.new_order = false;
            this.table.selected = -1;
         }
      },
      addOrder(new_order) {
         this.data.order.push(new_order);
      },
      updateOrder(fresh_order) {
         this.data.curr_order = fresh_order;
      },
      updateOrderField(value) {
         this.data.order[this.data.curr_order_index][value.field] = value.value;
      },
      updateOrderComandaField(value) {
         this.data.curr_order.comanda[value.index][value.field] = value.value;
      },
      removeOrderComanda(index) {
         this.data.curr_order.comanda.splice(index, 1);
      },
      onFiltered(filteredItems) {
        this.table.totalRows = filteredItems.length;
        this.table.currentPage = 1;
      },
      ///////////////
      // Functions //
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
   // #######################
   // ## Pagination Styles ##
   .customPagination > li {
      color: #707070 !important;
   }
   .customPagination > li.active,
   .customPagination > li:hover {
      color: #707070 !important;
      background: rgba(112, 112, 112, 0.59) !important;
   }
   .customPagination > li > button,
   .customPagination > li > span {
      color: white !important;
      background: #707070 !important;
   }
   .customPagination > li.active > button,
   .customPagination > li > button:hover,
   .customPagination > li.active > span,
   .customPagination > li > span:hover {
      color: white !important;
      background: rgba(112, 112, 112, 0.59) !important;
   }
   .page-link {
      border: none !important;
      padding: 10px 14px !important;
   }
</style>
