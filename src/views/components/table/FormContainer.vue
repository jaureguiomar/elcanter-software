<template>
   <div class="form-container">
      <div class="form-container-margin">
         <div class="form-container-content">
            <div class="form-title">
               <div class="left-content">
                  <font-awesome-icon icon="fa-solid fa-utensils" size="2x" />
               </div>
               <div class="right-content">
                  MESA NO. <span>{{ noTable }}</span>
               </div>
            </div>
            <div class="form-form">
               <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Personas</label>
                  <div class="col-sm-9">
                     <input v-model="personas" type="number" class="form-control form-control-sm" placeholder="Ingrese personas">
                  </div>
               </div>
               <!-- <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Cliente</label>
                  <div class="col-sm-9">
                     <select class="form-control form-control-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                     </select>
                  </div>
               </div> -->
               <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Mesero</label>
                  <div class="col-sm-9">
                     <input v-model="idmesero" type="text" class="form-control form-control-sm" placeholder="Ingrese mesero #">
                  </div>
               </div>
               <div class="form-grup row">
                  <button @click="onAbrirMesaClick" type="submit" class="btn btn-custom-orange col-md-12">
                     <font-awesome-icon icon="fa-solid fa-circle-chevron-right" />
                     Abrir mesa
                  </button>
               </div>
            </div>
         </div>
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
      noTable: {
         type: Number,
         required: false
      }
   },
   data() {
      return {
         personas: "",
         idmesero: ""
      };
   },
  methods: {
     async onAbrirMesaClick() {
         this.personas = parseInt(this.personas);
         if(isNaN(this.personas))
            this.personas = 0;

         if(this.personas <= 0) {
            this.$fire({
               title: "Error",
               text: "Debe haber ingresado cantidad de personas",
               type: "error"
            });
            return;
         }
         if(!this.idmesero) {
            this.$fire({
               title: "Error",
               text: "Debe haber ingresado el id del mesero",
               type: "error"
            });
            return;
         }

         //////////////////////////////
         // Validate if "corte" open //
         // Get last valid "corte"
         let response = null;
         let last_corte_id = null;
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
            last_corte_id = data["id"];
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

         // Insert sale
         let id_sale = -1;
         response = null;
         response = await Vue.prototype.$http.post("Ventas/insert", querystring.stringify({
            status: 1,
            idmesa: this.idTable,
            idmesero: this.idmesero,
            personas: this.personas,
            corte_id: last_corte_id
         }),
         {
            responseType: "text",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         });
         if(response) {
            const data = response.data;
            if(data != 0) {
               id_sale = data;
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

         // Get sale
         let sale_data = null;
         response = await Vue.prototype.$http.post("Ventas/get_by_id/" + id_sale, {}, {
            responseType: "text",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         });
         if(response) {
            const data = response.data;
            if(data) {
               sale_data = data;
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

         this.$emit("updateTableStatus", 2);
         this.$emit("updateCurrSale", sale_data);
     }
  }
};
</script>

<style lang="scss" scoped></style>
