<template>
   <div id="app">
      <div class="site-container">
        <div class="site-container-margin">
            <div class="site-container-content">
               <RouterView />
               <vueInternetChecked @status="onInternetStatus" />
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
      return {};
  },
  computed: {
      ...mapGetters([
         "getIsOnline"
      ])
   },
   async created() {
      this.$store.commit("SET_IS_ONLINE_DATA", window.navigator.onLine);
      this.getLastCorte();
   },
   methods: {
      async getLastCorte() {
         let http = null;
         if(this.getIsOnline)
            http = Vue.prototype.$http;
         else
            http = Vue.prototype.$httpLocal;

         //////////////////////////////
         // Validate if "corte" open //
         // Get last valid "corte"
         const vue_this = this;
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
                  text: "Debes iniciar corte antes de realizar ventas",
                  type: "error"
               });
               return;
            } else {
               console.log("last_corte", last_corte);
               vue_this.$store.commit("SET_CORTE_LAST", last_corte);
            }
         } else {
            this.$fire({
               title: "Error",
               text: "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.",
               type: "error"
            });
            return;
         }
      },
      async onInternetStatus(new_status) {
         this.$store.commit("SET_IS_ONLINE_DATA", new_status);

         // Retrieve unsync data & sync it
         if(new_status) {
            console.log("Internet went back");
            // const vue_this = this;
            // window.api.send("mysql-get-unsync-sales");
            // window.api.receive("mysql-get-unsync-sales-reply", function(data) {
            //    vue_this.data.offline.sales = data;
            //    window.api.send("mysql-get-unsync-money-movements");
            //    window.api.receive("mysql-get-unsync-money-movements-reply", async function(data) {
            //       vue_this.data.offline.money_movements = data;

            //       // Create sale
            //       for(let i = 0; i < vue_this.data.offline.sales.length; i++) {
            //          const curr_sale = vue_this.data.offline.sales[i];
            //          await Vue.prototype.$http.post("api/method/locmx33.utils.elpunto.create_pos_sale", {
            //             pos_profile: curr_sale.pos_profile,
            //             ticket_no: curr_sale.id.toString(),
            //             posting_date: vue_this.getFormattedDate(curr_sale.posting_date),
            //             posting_time: curr_sale.posting_time,
            //             items: JSON.parse( curr_sale.items),
            //             total: curr_sale.total,
            //             payments: JSON.parse(curr_sale.payments)
            //          });
            //       }

            //       // Create Money Movement
            //       for(let i = 0; i < vue_this.data.offline.money_movements.length; i++) {
            //          const curr_money_movement = vue_this.data.offline.money_movements[i];
            //          await Vue.prototype.$http.post("api/method/locmx33.utils.elpunto.create_movimiento_efectivo", {
            //             description: curr_money_movement.description,
            //             move_type: curr_money_movement.move_type,
            //             total: curr_money_movement.total,
            //             pos_profile: curr_money_movement.pos_profile,
            //             branch: curr_money_movement.branch,
            //             posting_date: vue_this.getFormattedDate(curr_money_movement.posting_date)
            //          });
            //       }

            //       vue_this.$fire({
            //          title: "Ok",
            //          text: "Se han sincronizado los datos online.",
            //          type: "success"
            //       });
            //       window.api.send("mysql-sync-offline-data");
            //    });
            // });
         }
      }
   }
};
</script>

<style lang="scss" scoped></style>
