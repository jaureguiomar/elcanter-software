<template>
   <div class="form-container">
      <div class="form-container-margin">
         <div class="form-container-content">
            <div class="form-title">
               <div class="left-content">
                  <font-awesome-icon icon="fa-solid fa-utensils" size="2x" />
               </div>
               <div class="right-content">
                  NUEVO PEDIDO
               </div>
            </div>
            <div class="form-form">
               <!-- <div class="form-group row">
                  <label class="col-sm-3 col-form-label">Cliente</label>
                  <div class="col-sm-9">
                     <select id="form-cliente" class="form-control form-control-sm">
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
                  <button @click="onAbrirPedidoClick" type="submit" class="btn btn-custom-orange col-md-12">
                     <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
                     Abrir pedido
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
const querystring = require("querystring");

export default {
   data() {
      return {
         idmesero: ""
      };
   },
   computed: {
      ...mapGetters([
         "getIsOnline"
      ])
   },
   methods: {
      async onAbrirPedidoClick() {
         if(!this.idmesero) {
            this.$fire({
               title: "Error",
               text: "Debe haber ingresado el id del mesero",
               type: "error"
            });
            return;
         }

         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         ////////////////////////////
         // Get last valid "corte" //
         let response = null;
         let last_corte_id = null;
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
            if(!data) {
               this.$fire({
                  title: "Error",
                  text: "No hay corte iniciado.",
                  type: "error"
               });
               return;
            } else {
               last_corte_id = data["id"];
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

         // Insert order
         let id_order = -1;
         response = await http.post("Pedidos/insert", querystring.stringify({
            status: 1,
            idmesero: this.idmesero,
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
               id_order = data;
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

         // Get inserted order
         let new_order = null;
         response = await http.get("Pedidos/get_by_id/" + id_order, {}, {
            responseType: "json",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         });
         if(response) {
            const data = response.data;
            if(data) {
               new_order = data;
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

         this.idmesero = "";
         if(new_order.status == 1)
            new_order.status = "Abierto";
         else
            new_order.status = "Cerrado";
         this.$emit("addOrder", new_order);
      }
   }
};
</script>

<style lang="scss" scoped></style>
