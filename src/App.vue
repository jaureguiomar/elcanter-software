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
export default {
  name: "App",
  data() {
      return {};
  },
   created() {
      this.$store.commit("SET_IS_ONLINE_DATA", window.navigator.onLine);
   },
   methods: {
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
