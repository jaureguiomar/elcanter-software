<template>
   <div class="footer-container">
      <div class="footer-container-margin">
         <div class="footer-container-content">
            <h4>
               Elcanterero Restaurante 2022 v0.3.3
               <span :style="[getIsOnline ? { color: 'green' } : { color: 'red' }]" style="margin-left: 10px;">({{ (getIsOnline) ? "Online" : "Offline" }})</span>
               <!-- <button :disabled="!getIsOnline" style="margin-left: 10px;" class="btn btn-sm btn-primary" @click="onRefreshItems">Actualizar registros offline</button> -->
            </h4>
         </div>
      </div>
   </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
   data() {
      return {};
   },
   computed: {
      ...mapGetters([
         "getIsOnline"
      ])
   },
   // created() {
   //    if(this.getIsOnline) {
   //       setTimeout(function() {
   //          this.onRefreshItems();
   //       }.bind(this), 1000);
   //    }
   // },
   methods: {
      async onRefreshItems() {
         let data = {};
         let response = null;

         response = await Vue.prototype.$http.get("Categorias/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #1.",
               type: "error"
            });
            return;
         }
         data.categoria_poroductos = response.data;

         response = await Vue.prototype.$http.get("Clientes/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #2.",
               type: "error"
            });
            return;
         }
         data.clientes = response.data;

         response = await Vue.prototype.$http.get("Comandas/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #3.",
               type: "error"
            });
            return;
         }
         data.comandas = response.data;

         response = await Vue.prototype.$http.get("ComandasPedidos/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #4.",
               type: "error"
            });
            return;
         }
         data.comandas_pedidos = response.data;

         response = await Vue.prototype.$http.get("Cortes/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #5.",
               type: "error"
            });
            return;
         }
         data.cortes = response.data;

         response = await Vue.prototype.$http.get("Faltantes/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #6.",
               type: "error"
            });
            return;
         }
         data.faltantes = response.data;

         response = await Vue.prototype.$http.get("Mesas/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #7.",
               type: "error"
            });
            return;
         }
         data.mesas = response.data;

         response = await Vue.prototype.$http.get("Meseros/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #8.",
               type: "error"
            });
            return;
         }
         data.meseros = response.data;

         response = await Vue.prototype.$http.get("Pedidos/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #9.",
               type: "error"
            });
            return;
         }
         data.pedidos = response.data;

         response = await Vue.prototype.$http.get("Productos/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #10.",
               type: "error"
            });
            return;
         }
         data.productos = response.data;

         response = await Vue.prototype.$http.get("Proveedores/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #11.",
               type: "error"
            });
            return;
         }
         data.proveedores = response.data;

         // response = await Vue.prototype.$http.get("Regpagop/get");
         // if(!response.data) {
         //    vue_this.$fire({
         //       title: "Error",
         //       text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #12.",
         //       type: "error"
         //    });
         //    return;
         // }
         // data.regpago = response.data;

         response = await Vue.prototype.$http.get("TipoUsuario/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #13.",
               type: "error"
            });
            return;
         }
         data.tipo_usuario = response.data;

         response = await Vue.prototype.$http.get("Usuarios/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #13.",
               type: "error"
            });
            return;
         }
         data.usuarios = response.data;

         response = await Vue.prototype.$http.get("Ventas/get");
         if(!response.data) {
            vue_this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo #14.",
               type: "error"
            });
            return;
         }
         data.ventas = response.data;

         const vue_this = this;
         window.api.send("mysql-data-bakup", data);
         window.api.receive("mysql-data-bakup-reply", function() {
            vue_this.$fire({
               title: "Ok",
               text: "Se ha creado el respaldo offline correctamente.",
               type: "success"
            });
         });
      }
   }
};
</script>

<style lang="scss" scoped></style>
