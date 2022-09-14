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
         "getCorteLast",
         "getIsOnline"
      ])
   },
   created() {
      if(this.title === "Barra") {
         console.error("---");
         console.log("idTable", this.idTable);
         console.log("statusTable", this.statusTable);
         console.log("noTable", this.noTable);
         console.log("currIdSelected", this.currIdSelected);
         console.log("fontSize", this.fontSize);
         console.log("index", this.index);
         console.log("title", this.title);
         console.log("this.getMesaBarra", this.getMesaBarra);
         console.log("this.getMesaBarra[index]", this.getMesaBarra[this.index]);
      }
   },
   methods: {
      async onTableContainerClick() {
         let new_id = -1;
         let new_status = -1;
         let no_table = -1;

         // Get last valid "corte"
         if(!this.getCorteLast) {
            this.$fire({
               title: "Error",
               text: "Debes iniciar corte antes de realizar ventas",
               type: "error"
            });
            return;
         } else {
            if(this.getCorteLast["status"] == 2) {
               this.$fire({
                  title: "Error",
                  text: "Debes iniciar corte antes de realizar ventas",
                  type: "error"
               });
               return;
            }
         }

         console.log("adnioanido");
         console.log("this.idTable", this.idTable);
         console.log("this.currIdSelected", this.currIdSelected);
         if(this.idTable == this.currIdSelected) {
            new_id = -1;
            new_status = -1;
            no_table = -1;
            this.$emit("updateCurrSaleItem", {});
         } else {
            new_id = this.idTable;
            new_status = this.statusTable;
            no_table = this.noTable;

            let http = null;
            if(this.getIsOnline)
               http = Vue.prototype.$http;
            else
               http = Vue.prototype.$httpLocal;

            // Get sale by "idTable"
            console.log("new_status", new_status);
            if(new_status == 2) {
               let response = await http.post("Ventas/get_where", querystring.stringify({
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
                  console.log("data", data);
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
