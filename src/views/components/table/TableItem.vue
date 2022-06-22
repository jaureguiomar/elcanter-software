<template>
   <div
      @click="onTableContainerClick"
      class="table-container"
      :class="
         [(statusTable == 2 ? 'active' : ''),
         (currIdSelected == idTable ? 'selected' : '')]
      "
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
const querystring = require("querystring");

export default {
   props: {
      idTable: {
         type: Number,
         required: false
      },
      statusTable: {
         type: Number,
         required: false
      },
      noTable: {
         type: Number,
         required: false
      },
      currIdSelected: {
         type: Number,
         required: true
      },
      fontSize: {
         type: Number,
         required: false
      }
   },
   data() {
      return {
      };
   },
   methods: {
      async onTableContainerClick() {
         let new_id = -1;
         let new_status = -1;
         let no_table = -1;

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
                  text: "Debes iniciar corte antes de realizar ventas",
                  type: "error"
               });
               return;
            } else {
               if(last_corte["status"] == 2) {
                  this.$fire({
                     title: "Error",
                     text: "Debes iniciar corte antes de realizar ventas",
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

         if(this.idTable == this.currIdSelected) {
            new_id = -1;
            new_status = -1;
            no_table = -1;
            this.$emit("updateCurrSaleItem", {});
         } else {
            new_id = this.idTable;
            new_status = this.statusTable;
            no_table = this.noTable;

            // Get sale by "idTable"
            if(new_status == 2) {
               let response = await Vue.prototype.$http.post("Ventas/get_where", querystring.stringify({
                  status: 1,
                  idmesa: new_id
               }), {
                  responseType: "text",
                  headers: {
                     "X-Requested-With": "XMLHttpRequest",
                     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                  }
               });
               if(response) {
                  const data = response.data;
                  if(data) {
                    this.$emit("updateCurrSaleItem", data);
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
            } else {
               this.$emit("updateCurrSaleItem", {});
            }
         }

         this.$emit("updateCurrSelectedItem", {
            id: new_id,
            status: new_status,
            no_table: no_table
         });
      }
   }
};
</script>

<style lang="scss" scoped></style>
