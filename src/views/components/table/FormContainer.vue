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
                  <button type="submit" class="btn btn-custom-orange col-md-12" @click="onAbrirMesaClick">
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
import { mapGetters } from "vuex";
const querystring = require("querystring");

export default {
   props: {
      idTable: {
         type: Number,
         required: false,
         default: -1
      },
      noTable: {
         type: Number,
         required: false,
         default: -1
      },
      title: {
         type: String,
         required: true
      },
      index: {
         type: Number,
         required: true
      }
   },
   data() {
      return {
         personas: "",
         idmesero: ""
      };
   },
   computed: {
      ...mapGetters([
         "getCorteLast",
         "getIsOnline"
      ])
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

         // Get last valid "corte"
         if(!this.getCorteLast) {
            this.$fire({
               title: "Error",
               text: "No hay corte iniciado.",
               type: "error"
            });
            return;
         }

         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         // Insert sale
         let id_sale = -1;
         let response = await http.post("Ventas/insert", querystring.stringify({
            status: 1,
            idmesa: this.idTable,
            idmesero: this.idmesero,
            personas: this.personas,
            corte_id: this.getCorteLast["id"]
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
         response = await http.post("Ventas/get_by_id/" + id_sale, {}, {
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

         this.$store.commit("SET_MESA_BARRA_BY_INDEX", sale_data);
         this.$emit("updateTableStatus", 2);
         this.$emit("updateCurrSale", sale_data);
     }
  }
};
</script>

<style lang="scss" scoped></style>
