<template>
   <div>
      <HeaderElem />

       <div class="content-container">
           <div class="content-container-margin">
               <div class="content-container-content">
                  <LeftContentElem>
                     <template #title>
                        <div class="content-title-left">
                           <h4>
                              Lista de mesas
                              <a href="#_" @click="onRefreshTables">
                                 <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
                              </a>
                           </h4>
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
                                         typeContainer: ['item-content-cocina'],
                                         data: [getMesaCocina]
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
                                          ],
                                          data: [getMesaBarra, getMesaPatio1, getMesaPatio2]
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
                                         typeContainer: ['item-content-presidencial'],
                                         data: [getMesaPresidencial]
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
                                         typeContainer: ['item-content-redonda'],
                                         data: [getMesaRedonda]
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
                                         typeContainer: ['item-content-cuartito'],
                                         data: [getMesaCuartito]
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
                           :idTable="data.table.selected.id"
                           :noTable="data.table.selected.no_table"
                           :title="data.table.selected.title"
                           :index="data.table.selected.index"
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
                           :title="data.table.selected.title"
                           :index="data.table.selected.index"
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
import { mapGetters } from "vuex";
const querystring = require("querystring");
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
                  title: null,
                  index: -1,
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
   computed: {
      ...mapGetters([
         "getMesaBarra",
         "getMesaCocina",
         "getMesaCuartito",
         "getMesaPatio1",
         "getMesaPatio2",
         "getMesaPresidencial",
         "getMesaRedonda",
         "getMesaBakup",
         "getIsOnline"
      ])
   },
   async created() {
      this.retrieveAllMesasData();
      if(!this.getMesaBakup) {
         this.retrieveAllSalesData();
         this.$store.commit("SET_MESA_BAKUP", true);
      }
   },
   methods: {
      updateCurrSelected(newTableData) {
         this.data.table.selected.id = newTableData.id;
         this.data.table.selected.status = newTableData.status;
         this.data.table.selected.no_table = newTableData.no_table;
         this.data.table.selected.title = newTableData.title;
         this.data.table.selected.index = newTableData.index;
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
      async retrieveMesaData(id_mesa) {
         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         let response = await http.post("Ventas/get_where", querystring.stringify({
            status: 1,
            idmesa: id_mesa
         }), {
            responseType: "text",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         });
         if(response) {
            const data = response.data;
            if(data)
               return data;
            else
               return {};
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return {};
         }
      },
      onRefreshTables() {
         this.retrieveAllMesasData();
         this.retrieveAllSalesData();
      },
      ///////////////
      // Functions //
      async retrieveAllMesasData() {
         // Reset mesas data
         this.data.table.table.patio.patio1 = [];
         this.data.table.table.patio.patio1 = [];
         this.data.table.table.patio.patio1 = [];
         this.data.table.table.patio.patio2 = [];
         this.data.table.table.patio.patio2 = [];

         this.data.table.status.patio.patio1 = [];
         this.data.table.status.patio.patio1 = [];
         this.data.table.status.patio.patio1 = [];
         this.data.table.status.patio.patio2 = [];
         this.data.table.status.patio.patio2 = [];

         ////////////////////
         // Get Mesas Data //
         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;
         let response = await http.get("Rutes/venta_mesas");
         if(response) {
            const data = response.data;
            this.data.table.data = data;

            //////////////////
            // Setup tables //
            this.data.table.table.barra = this.retrieveDataArray(data.mesasbarra, "nomesa");
            this.data.table.table.cocina = this.retrieveDataArray(data.mesascocina, "nomesa");
            this.data.table.table.cuartito = this.retrieveDataArray(data.mesascocuartito, "nomesa");
            this.data.table.table.patio.patio = this.retrieveDataArray(data.mesaspatio, "nomesa");
            this.data.table.table.presidencial = this.retrieveDataArray(data.mesasprecidencial, "nomesa");
            this.data.table.table.redonda = this.retrieveDataArray(data.mesasredonda, "nomesa");
            // Setup "patio" arrays
            this.data.table.table.patio.patio1.push(this.data.table.table.patio.patio[0]);
            this.data.table.table.patio.patio1.push(this.data.table.table.patio.patio[1]);
            this.data.table.table.patio.patio1.push(this.data.table.table.patio.patio[2]);
            this.data.table.table.patio.patio2.push(this.data.table.table.patio.patio[3]);
            this.data.table.table.patio.patio2.push(this.data.table.table.patio.patio[4]);

            //////////////////
            // Setup status //
            this.data.table.status.barra = this.retrieveDataArray(data.mesasbarra, "status");
            this.data.table.status.cocina = this.retrieveDataArray(data.mesascocina, "status");
            this.data.table.status.cuartito = this.retrieveDataArray(data.mesascocuartito, "status");
            this.data.table.status.patio.patio = this.retrieveDataArray(data.mesaspatio, "status");
            this.data.table.status.presidencial = this.retrieveDataArray(data.mesasprecidencial, "status");
            this.data.table.status.redonda = this.retrieveDataArray(data.mesasredonda, "status");
            // Setup "patio" arrays
            this.data.table.status.patio.patio1.push(this.data.table.status.patio.patio[0]);
            this.data.table.status.patio.patio1.push(this.data.table.status.patio.patio[1]);
            this.data.table.status.patio.patio1.push(this.data.table.status.patio.patio[2]);
            this.data.table.status.patio.patio2.push(this.data.table.status.patio.patio[3]);
            this.data.table.status.patio.patio2.push(this.data.table.status.patio.patio[4]);
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
         }
      },
      async retrieveAllSalesData() {
         // Reset global data
         this.data.table.selected.id = -1;
         this.data.table.selected.status = -1;
         this.data.table.selected.no_table = -1;
         this.data.table.selected.title = null;
         this.data.table.selected.index = -1;
         this.data.table.selected.curr_sale = {};

         // Reset ventas data
         this.$store.commit("SET_MESA_BARRA", []);
         this.$store.commit("SET_MESA_COCINA", []);
         this.$store.commit("SET_MESA_CUARTITO", []);
         this.$store.commit("SET_MESA_PATIO1", []);
         this.$store.commit("SET_MESA_PATIO2", []);
         this.$store.commit("SET_MESA_PRESIDENCIAL", []);
         this.$store.commit("SET_MESA_REDONDA", []);

         /////////////////////
         // Get Ventas Data //
         let barra_data = [];
         for(let i = 0; i < this.data.table.id_table.barra.length; i++) {
            const curr_id = this.data.table.id_table.barra[i];
            barra_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_BARRA", barra_data);

         let cocina_data = [];
         for(let i = 0; i < this.data.table.id_table.cocina.length; i++) {
            const curr_id = this.data.table.id_table.cocina[i];
            cocina_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_COCINA", cocina_data);

         let cuartito_data = [];
         for(let i = 0; i < this.data.table.id_table.cuartito.length; i++) {
            const curr_id = this.data.table.id_table.cuartito[i];
            cuartito_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_CUARTITO", cuartito_data);

         let patio1_data = [];
         for(let i = 0; i < this.data.table.id_table.patio.patio1.length; i++) {
            const curr_id = this.data.table.id_table.patio.patio1[i];
            patio1_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_PATIO1", patio1_data);

         let patio2_data = [];
         for(let i = 0; i < this.data.table.id_table.patio.patio2.length; i++) {
            const curr_id = this.data.table.id_table.patio.patio2[i];
            patio2_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_PATIO2", patio2_data);

         let presidencial_data = [];
         for(let i = 0; i < this.data.table.id_table.presidencial.length; i++) {
            const curr_id = this.data.table.id_table.presidencial[i];
            presidencial_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_PRESIDENCIAL", presidencial_data);

         let redonda_data = [];
         for(let i = 0; i < this.data.table.id_table.redonda.length; i++) {
            const curr_id = this.data.table.id_table.redonda[i];
            redonda_data.push(await this.retrieveMesaData(curr_id));
         }
         this.$store.commit("SET_MESA_REDONDA", redonda_data);

         this.$fire({
            title: "Ok",
            text: "Informacion de las mesas actualizadas correctamente",
            type: "success"
         });
      },
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
