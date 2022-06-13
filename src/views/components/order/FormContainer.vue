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
const querystring = require("querystring");

export default {
   data() {
      return {
         idmesero: ""
      };
   },
   methods: {
      async onAbrirPedidoClick() {
         if(!this.idmesero) {
            alert("Debe haber ingresado el id del mesero");
            return;
         }

         // Insert order
         let response = null;
         let id_order = -1;
         response = await Vue.prototype.$http.post("Pedidos/insert", querystring.stringify({
            status: 1,
            idmesero: this.idmesero
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
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
               return;
            }
         } else {
            alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            return;
         }

         // Get inserted order
         let new_order = null;
         response = await Vue.prototype.$http.get("Pedidos/get_by_id/" + id_order, {}, {
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
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
               return;
            }
         } else {
            alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
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
