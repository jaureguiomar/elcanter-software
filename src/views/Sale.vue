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
                                <h4>Ventas</h4>
                            </div>
                            <div class="content-title-right">
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
                                             Buscar venta
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
                                             ref="selectableTable"
                                             :items="data.sale"
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
                                             striped
                                             hover
                                             selectable
                                             :select-mode="'single'"
                                             @filtered="onFiltered"
                                             @row-selected="onSaleRowClick"
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
                           v-if="table.selected <= 0 && !data.new_sale"
                        />
                        <TotalContainerElem
                           v-if="table.selected > 0 && !data.new_sale"
                           :data="data.curr_sale"
                           type="table"
                           :title="data.title"
                           :index="data.index"
                           @updateOrder="updateSale"
                           @updateOrderField="updateSaleField"
                           @updateOrderComandaField="updateSaleComandaField"
                           @removeOrderComanda="removeSaleComanda"
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
import { mapGetters } from "vuex";
import compHeader from "@/views/layout/Header.vue";
import compFooter from "@/views/layout/Footer.vue";
import compLeftContent from "@/views/layout/LeftContent.vue";
import compRightContent from "@/views/layout/RightContent.vue";
import compEmptyOkContainer from "@/views/components/shared/EmptyOkContainer.vue";
import compTotalContainer from "@/views/components/shared/TotalContainer.vue";

export default {
   components: {
      HeaderElem: compHeader,
      FooterElem: compFooter,
      LeftContentElem: compLeftContent,
      RightContentElem: compRightContent,
      EmptyOkContainerElem: compEmptyOkContainer,
      TotalContainerElem: compTotalContainer
   },
   data() {
      return {
         data: {
            sale: [],
            curr_sale: {},
            curr_sale_index: -1,
            new_sale: false,
            title: null,
            index: -1
         },
         table: {
            selected: -1,
            fields: [
               { key: "idventa", label: "No. de Venta", sortable: true, sortDirection: "desc", class: "text-center" },
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
               },
               {
                  key: "fecha_final",
                  label: "Fecha",
                  sortable: false,
                  sortByFormatted: true,
                  filterByFormatted: true,
                  class: "text-center",
                  formatter: (date) => {
                     let new_date = date;
                     if(new_date) {
                        const splitted_date = date.split("-");
                        if(splitted_date.length === 3) {
                           let day = parseInt(splitted_date[2]);
                           let month = parseInt(splitted_date[1]);
                           const year = parseInt(splitted_date[0]);
                           if(day < 10)
                              day = "0" + 10;
                           switch(month) {
                              case 1: month = "Enero"; break;
                              case 2: month = "Febrero"; break;
                              case 3: month = "Marzo"; break;
                              case 4: month = "Abril"; break;
                              case 5: month = "Mayo"; break;
                              case 6: month = "Junio"; break;
                              case 7: month = "Julio"; break;
                              case 8: month = "Agosto"; break;
                              case 9: month = "Septiembre"; break;
                              case 10: month = "Octubre"; break;
                              case 11: month = "Noviembre"; break;
                              case 12: month = "Diciembre"; break;
                           }
                           new_date = day + "/" + month + "/" + year;
                        }
                     } else {
                        new_date = "----";
                     }
                     return new_date;
                  }
               },
               {
                  key: "hora_final",
                  label: "Hora",
                  sortable: false,
                  sortByFormatted: true,
                  filterByFormatted: true,
                  class: "text-center",
                  formatter: (time) => {
                     if(!time)
                        return "----";
                     else
                        return time;
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
            sortBy: "idventa",
            sortDesc: true,
            sortDirection: "desc",
            filter: null,
            filterOn: []
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
      http.get("Rutes/venta_ventas")
         .then(function (response) {
            if(response) {
               const data = response.data;
               vue_this.data.sale = data;
               vue_this.table.totalRows = vue_this.data.sale.length;
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
      onNewSaleClick() {
         this.data.new_sale = true;
         this.table.selected = -1;
      },
      onDownloadCSV() {
         let file_date = "";
         let file_data = "";

         file_date = this.getFileDate();
         file_data = "Id Venta, Id Mesero, Mesero, Estatus, Total, Hora Inicio, Hora Final\n";

         for(let i = 0; i < this.data.sale.length; i++) {
            const curr_sale = this.data.sale[i];
            file_data += `${ curr_sale.idventa }, ${ curr_sale.idmesero }, ${ curr_sale.mesero.nombre + ' ' + curr_sale.mesero.apellidos }, ${ curr_sale.status }, $${ curr_sale.total }, ${ curr_sale.hora_inicio }, ${ (curr_sale.hora_final) ? curr_sale.hora_final : "" }`;
            if(i <= this.data.sale.length)
               file_data += "\n";
         }

         const anchor = document.createElement("a");
         anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(file_data);
         anchor.target = "_blank";
         anchor.download = "ventas-reporte" + file_date + ".csv";
         anchor.click();
         anchor.remove();
      },
      onSaleRowClick(selected_sale) {
         // if(this.table.selected == selected_sale.idventa)
         //    return;

         if(selected_sale.length > 0) {
            let index = -1;
            selected_sale = selected_sale[0];

            for(let i = 0; i < this.data.sale.length; i++) {
               const curr_oder = this.data.sale[i];
               if(selected_sale.idventa == curr_oder.idventa) {
                  index = i;
                  break;
               }
            }

            this.data.new_sale = false;
            this.table.selected = selected_sale.idventa;

            let http = null;
            if(this.getIsOnline)
               http = Vue.prototype.$http;
            else
               http = Vue.prototype.$httpLocal;

            const vue_this = this;
            http.post("Ventas/get_by_id/" + this.table.selected)
               .then(function (response) {
                  if(response) {
                     const data = response.data;

                     if(data.mesa.croquis === "Cocina")
                        vue_this.data.title = "cocina";
                     else if(data.mesa.croquis === "Patio")
                        if(data.mesa.nomesa == 1 || data.mesa.nomesa == 2 || data.mesa.nomesa == 3)
                           vue_this.data.title = "patio1";
                        else
                           vue_this.data.title = "patio2";
                     else if(data.mesa.croquis === "Presidencial")
                        vue_this.data.title = "presidencial";
                     else if(data.mesa.croquis === "Redonda")
                        vue_this.data.title = "redonda";
                     else if(data.mesa.croquis === "Cuartito")
                        vue_this.data.title = "cuartito";
                     else if(data.mesa.croquis === "Barra")
                        vue_this.data.title = "barra";
                     vue_this.data.index = parseInt(data.mesa.nomesa) - 1;

                     vue_this.data.curr_sale = data;
                     vue_this.data.curr_sale_index = index;
                  } else {
                     this.$fire({
                        title: "Error",
                        text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
                        type: "error"
                     });
                  }
               });
         } else {
            this.data.new_sale = false;
            this.table.selected = -1;
         }
      },
      updateSale(fresh_sale) {
         this.data.curr_sale = fresh_sale;
      },
      updateSaleField(value) {
         this.data.sale[this.data.curr_sale_index][value.field] = value.value;
      },
      updateSaleComandaField(value) {
         this.data.curr_sale.comanda[value.index][value.field] = value.value;
      },
      removeSaleComanda(index) {
         this.data.curr_sale.comanda.splice(index, 1);
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
