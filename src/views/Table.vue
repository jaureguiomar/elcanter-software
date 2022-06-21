<template>
   <div>
      <HeaderElem />

       <div class="content-container">
           <div class="content-container-margin">
               <div class="content-container-content">
                  <LeftContentElem>
                     <template #title>
                        <div class="content-title-left">
                           <h4>Lista de mesas</h4>
                        </div>
                     </template>

                     <template #content>
                        <div class="tables-container">
                           <div class="tables-container-margin">
                                <div class="tables-container-content">
                                    <TableItemContainerElem
                                      :data="{
                                         item_containers: 1,
                                         size: 'table-minismall',
                                         title: ['Cocina'],
                                         noTables: [6],
                                         fontTables: [[0, 0, 0, 0, 0, 0]],
                                         idTables: [data.table.id_table.cocina],
                                         statusTables: [data.table.status.cocina],
                                         noTables: [data.table.table.cocina],
                                         typeContainer: ['item-content-cocina']
                                      }"
                                      :currIdSelected="data.table.selected.id"
                                      @updateCurrSale="updateCurrSale"
                                      @updateCurrSelected="updateCurrSelected"
                                    />
                                    <TableItemContainerElem
                                       :data="{
                                          item_containers: 3,
                                          size: 'table-small',
                                          title: ['Barra', 'Patio', ''],
                                          noTables: [3, 3, 2],
                                          fontTables: [[9, 9, 9], [9, 9, 9], [0, 0]],
                                          idTables: [
                                             data.table.id_table.barra,
                                             data.table.id_table.patio.patio1,
                                             data.table.id_table.patio.patio2
                                          ],
                                          statusTables: [
                                             data.table.status.barra,
                                             data.table.status.patio.patio1,
                                             data.table.status.patio.patio2
                                          ],
                                          noTables: [
                                             data.table.table.barra,
                                             data.table.table.patio.patio1,
                                             data.table.table.patio.patio2
                                          ],
                                          typeContainer: [
                                             'item-content-barra', 'item-content-patio',
                                             'item-content-patio2'
                                          ]
                                       }"
                                       :currIdSelected="data.table.selected.id"
                                       @updateCurrSale="updateCurrSale"
                                       @updateCurrSelected="updateCurrSelected"
                                    />
                                    <TableItemContainerElem
                                      :data="{
                                         item_containers: 1,
                                         size: 'table-minismall',
                                         title: ['Presidencial'],
                                         noTables: [6],
                                         fontTables: [[0, 0, 0, 0, 0, 0]],
                                         idTables: [data.table.id_table.presidencial],
                                         statusTables: [data.table.status.presidencial],
                                         noTables: [data.table.table.presidencial],
                                         typeContainer: ['item-content-presidencial']
                                      }"
                                      :currIdSelected="data.table.selected.id"
                                      @updateCurrSale="updateCurrSale"
                                      @updateCurrSelected="updateCurrSelected"
                                    />
                                    <TableItemContainerElem
                                      :data="{
                                         item_containers: 1,
                                         size: 'table-superminismall',
                                         title: ['Redonda'],
                                         noTables: [3],
                                         fontTables: [[0, 0, 0]],
                                         idTables: [data.table.id_table.redonda],
                                         statusTables: [data.table.status.redonda],
                                         noTables: [data.table.table.redonda],
                                         typeContainer: ['item-content-redonda']
                                      }"
                                      :currIdSelected="data.table.selected.id"
                                      @updateCurrSale="updateCurrSale"
                                      @updateCurrSelected="updateCurrSelected"
                                    />
                                    <TableItemContainerElem
                                      :data="{
                                         item_containers: 1,
                                         size: 'table-superminismall',
                                         title: ['Cuartito'],
                                         noTables: [4],
                                         fontTables: [[0, 0, 0, 0]],
                                         idTables: [data.table.id_table.cuartito],
                                         statusTables: [data.table.status.cuartito],
                                         noTables: [data.table.table.cuartito],
                                         typeContainer: ['item-content-cuartito']
                                      }"
                                      :currIdSelected="data.table.selected.id"
                                      @updateCurrSale="updateCurrSale"
                                      @updateCurrSelected="updateCurrSelected"
                                    />
                                </div>
                           </div>
                        </div>
                     </template>
                  </LeftContentElem>

                  <RightContentElem>
                     <template #content>
                        <EmptyContainerElem
                           v-if="
                              data.table.selected.id == -1 &&
                              data.table.selected.status == -1"
                        />
                        <EmptyErrorContainerElem
                           v-if="
                              (data.table.selected.id != -1 && data.table.selected.status == -1) ||
                              (data.table.selected.id == -1 && data.table.selected.status != -1)
                           "
                        />
                        <FormContainerElem
                           v-if="
                              data.table.selected.id != -1 &&
                              data.table.selected.status == 1
                           "
                           :noTable="data.table.selected.no_table"
                           :idTable="data.table.selected.id"
                           @updateTableStatus="updateTableStatus"
                           @updateCurrSale="updateCurrSale"
                        />
                        <TotalContainerElem
                           v-show="
                              data.table.selected.id != -1 &&
                              data.table.selected.status == 2
                           "
                           :data="data.table.selected.curr_sale"
                           type="table"
                           @updateOrder="updateOrder"
                           @updateOrderComandaField="updateOrderComandaField"
                           @removeOrderComanda="removeOrderComanda"
                           @updateCurrSelected="updateCurrSelected"
                           @updateTableStatus="updateTableStatus"
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
import compTableItemContainer from "@/views/components/table/TableItemContainer.vue";
import compEmptyContainer from "@/views/components/shared/EmptyContainer.vue";
import compFormContainer from "@/views/components/table/FormContainer.vue";
import compEmptyErrorContainer from "@/views/components/shared/EmptyErrorContainer.vue";
import compTotalContainer from "@/views/components/shared/TotalContainer.vue";

export default {
   components: {
      HeaderElem: compHeader,
      FooterElem: compFooter,
      LeftContentElem: compLeftContent,
      RightContentElem: compRightContent,
      TableItemContainerElem: compTableItemContainer,
      EmptyContainerElem: compEmptyContainer,
      FormContainerElem: compFormContainer,
      EmptyErrorContainerElem: compEmptyErrorContainer,
      TotalContainerElem: compTotalContainer
   },
   data() {
      return {
         data: {
            table: {
               data: [],
               selected: {
                  id: -1,
                  status: -1,
                  no_table: -1,
                  curr_sale: {}
               },
               id_table: {
                  barra: [23, 24, 25],
                  cocina: [1, 2, 3, 4, 5, 6],
                  cuartito: [18, 19, 20, 21],
                  patio: {
                     // patio: [],
                     patio1: [7, 8, 9],
                     patio2: [10, 22]
                  },
                  presidencial: [11, 12, 13, 14, 26, 27],
                  redonda: [15, 16, 17]
               },
               table: {
                  barra: [],
                  cocina: [],
                  cuartito: [],
                  patio: {
                     patio: [],
                     patio1: [],
                     patio2: []
                  },
                  presidencial: [],
                  redonda: []
               },
               status: {
                  barra: [],
                  cocina: [],
                  cuartito: [],
                  patio: {
                     patio: [],
                     patio1: [],
                     patio2: []
                  },
                  presidencial: [],
                  redonda: []
               }
            }
         }
      };
   },
   created() {
      const vue_this = this;
      Vue.prototype.$http.get("Rutes/venta_mesas")
         .then(function (response) {
            if(response) {
               const data = response.data;
               vue_this.data.table.data = data;

               //////////////////
               // Setup tables //
               vue_this.data.table.table.barra = vue_this.retrieveDataArray(data.mesasbarra, "nomesa");
               vue_this.data.table.table.cocina = vue_this.retrieveDataArray(data.mesascocina, "nomesa");
               vue_this.data.table.table.cuartito = vue_this.retrieveDataArray(data.mesascocuartito, "nomesa");
               vue_this.data.table.table.patio.patio = vue_this.retrieveDataArray(data.mesaspatio, "nomesa");
               vue_this.data.table.table.presidencial = vue_this.retrieveDataArray(data.mesasprecidencial, "nomesa");
               vue_this.data.table.table.redonda = vue_this.retrieveDataArray(data.mesasredonda, "nomesa");
               // Setup "patio" arrays
               vue_this.data.table.table.patio.patio1.push(vue_this.data.table.table.patio.patio[0]);
               vue_this.data.table.table.patio.patio1.push(vue_this.data.table.table.patio.patio[1]);
               vue_this.data.table.table.patio.patio1.push(vue_this.data.table.table.patio.patio[2]);
               vue_this.data.table.table.patio.patio2.push(vue_this.data.table.table.patio.patio[3]);
               vue_this.data.table.table.patio.patio2.push(vue_this.data.table.table.patio.patio[4]);

               //////////////////
               // Setup status //
               vue_this.data.table.status.barra = vue_this.retrieveDataArray(data.mesasbarra, "status");
               vue_this.data.table.status.cocina = vue_this.retrieveDataArray(data.mesascocina, "status");
               vue_this.data.table.status.cuartito = vue_this.retrieveDataArray(data.mesascocuartito, "status");
               vue_this.data.table.status.patio.patio = vue_this.retrieveDataArray(data.mesaspatio, "status");
               vue_this.data.table.status.presidencial = vue_this.retrieveDataArray(data.mesasprecidencial, "status");
               vue_this.data.table.status.redonda = vue_this.retrieveDataArray(data.mesasredonda, "status");
               // Setup "patio" arrays
               vue_this.data.table.status.patio.patio1.push(vue_this.data.table.status.patio.patio[0]);
               vue_this.data.table.status.patio.patio1.push(vue_this.data.table.status.patio.patio[1]);
               vue_this.data.table.status.patio.patio1.push(vue_this.data.table.status.patio.patio[2]);
               vue_this.data.table.status.patio.patio2.push(vue_this.data.table.status.patio.patio[3]);
               vue_this.data.table.status.patio.patio2.push(vue_this.data.table.status.patio.patio[4]);
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
      updateCurrSelected(newTableData) {
         this.data.table.selected.id = newTableData.id;
         this.data.table.selected.status = newTableData.status;
         this.data.table.selected.no_table = newTableData.no_table;
      },
      updateTableStatus(newStatus) {
         let finded = this.findFieldById(this.data.table.selected.id);
         if(finded["key"].indexOf("patio") === -1)
            this.data.table.status[finded["key"]][finded["index"]] = newStatus;
         else
            this.data.table.status["patio"][finded["key"]][finded["index"]] = newStatus;
         this.data.table.selected.status = newStatus;
      },
      updateCurrSale(newSale) {
         this.data.table.selected.curr_sale = newSale;
      },
      updateOrder(fresh_sale) {
         this.data.table.selected.curr_sale = fresh_sale;
      },
      updateOrderComandaField(value) {
         this.data.table.selected.curr_sale.comanda[value.index][value.field] = value.value;
      },
      removeOrderComanda(index) {
         this.data.table.selected.curr_sale.comanda.splice(index, 1);
      },
      ///////////////
      // Functions //
      findFieldById(id) {
         let finded = {
            index: -1,
            key: ""
         };

         for(let i = 0; i < this.data.table.id_table.barra.length; i++) {
            const curr_id = this.data.table.id_table.barra[i];
            if(id == curr_id) {
               finded.index = i;
               finded.key = "barra";
               break;
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.cocina.length; i++) {
               const curr_id = this.data.table.id_table.cocina[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "cocina";
                  break;
               }
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.cuartito.length; i++) {
               const curr_id = this.data.table.id_table.cuartito[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "cuartito";
                  break;
               }
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.patio.patio1.length; i++) {
               const curr_id = this.data.table.id_table.patio.patio1[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "patio1";
                  break;
               }
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.patio.patio2.length; i++) {
               const curr_id = this.data.table.id_table.patio.patio2[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "patio2";
                  break;
               }
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.presidencial.length; i++) {
               const curr_id = this.data.table.id_table.presidencial[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "presidencial";
                  break;
               }
            }
         }
         if(finded.index == -1) {
            for(let i = 0; i < this.data.table.id_table.redonda.length; i++) {
               const curr_id = this.data.table.id_table.redonda[i];
               if(id == curr_id) {
                  finded.index = i;
                  finded.key = "redonda";
                  break;
               }
            }
         }

         return finded;
      },
      retrieveDataArray(data, field) {
         let result = [];
         for(let i = 0; i < data.length; i++) {
            const curr_data = data[i];
            const curr_status = parseInt(curr_data[field]);
            result.push(curr_status);
         }
         return result;
      }
   }
};
</script>

<style lang="scss" scoped></style>
