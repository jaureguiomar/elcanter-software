<template>
   <div
      class="table-container"
      :class="
         [(statusTable == 2 ? 'active' : ''),
         (currIdSelected == idTable ? 'selected' : '')]
      "
      @click="onTableContainerClick"
   >
      <div class="table-container-margin">
         <a
            href="#"
            :class="
               [(statusTable == 2 ? 'active' : ''),
               (currIdSelected == idTable ? 'selected' : '')]
            "
         >
            <div class="table-container-content">
               <div
                  :style="[(fontSize && fontSize > 0) ? {'font-size': + fontSize + 'px'} : '{}']"
                  class="table-title"
               >
                  <p>Mesa</p>
               </div>
               <div class="table-number">
                  <h4>
                     <slot name="no-table"></slot>
                  </h4>
               </div>
            </div>
         </a>
      </div>
   </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
   props: {
      idTable: {
         type: Number,
         required: true
      },
      statusTable: {
         type: Number,
         required: true
      },
      noTable: {
         type: Number,
         required: true
      },
      currIdSelected: {
         type: Number,
         required: true
      },
      fontSize: {
         type: Number,
         required: false,
         default: 0
      },
      index: {
         type: Number,
         required: true
      },
      title: {
         type: String,
         required: true
      }
   },
   data() {
      return {};
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
         "getIsOnline"
      ])
   },
   methods: {
      async onTableContainerClick() {
         let new_id = -1;
         let new_status = -1;
         let new_no_table = -1;
         let new_title = null;
         let new_index = -1;
         let new_name_table = null;

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
            if(!last_corte) {
               this.$fire({
                  title: "Error",
                  text: "Debes iniciar corte antes de realizar pedidos",
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
         ////////////////////////////
         ////////////////////////////

         let data = {};
         if(this.idTable != this.currIdSelected) {
            let finded = false;
            new_id = this.idTable;
            new_status = this.statusTable;
            new_no_table = this.noTable;
            new_index = this.index;

            if(this.title === "Cocina") {
               data = this.getMesaCocina[this.index];
               new_title = "cocina";
               finded = true;
            } else if(this.title === "Barra") {
               data = this.getMesaBarra[this.index];
               new_title = "barra";
               finded = true;
            } else if(this.title === "Patio") {
               data = this.getMesaPatio1[this.index];
               new_title = "patio1";
               finded = true;
            } else if(this.title === "") {
               data = this.getMesaPatio2[this.index];
               new_title = "patio2";
               finded = true;
            } else if(this.title === "Presidencial") {
               data = this.getMesaPresidencial[this.index];
               new_title = "presidencial";
               finded = true;
            } else if(this.title === "Redonda") {
               data = this.getMesaRedonda[this.index];
               new_title = "redonda";
               finded = true;
            } else if(this.title === "Cuartito") {
               data = this.getMesaCuartito[this.index];
               new_title = "cuartito";
               finded = true;
            }

            if(finded && "mesa" in data)
               new_name_table = data.mesa.croquis;
         }

         this.$emit("updateCurrSaleItem", data);
         this.$emit("updateCurrSelectedItem", {
            id: new_id,
            status: new_status,
            no_table: new_no_table,
            title: new_title,
            index: new_index,
            name_table: new_name_table
         });
      }
   }
};
</script>

<style lang="scss" scoped></style>
