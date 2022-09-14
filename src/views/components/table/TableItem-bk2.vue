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
         "getCorteLast",
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

         let data = {};
         if(this.idTable != this.currIdSelected) {
            new_id = this.idTable;
            new_status = this.statusTable;
            new_no_table = this.noTable;
            new_title = this.title;
            new_index = this.index;

            if(this.title === "Cocina")
               data = this.getMesaCocina[this.index];
            else if(this.title === "Barra")
               data = this.getMesaBarra[this.index];
            else if(this.title === "Patio")
               data = this.getMesaPatio1[this.index];
            else if(this.title === "")
               data = this.getMesaPatio2[this.index];
            else if(this.title === "Presidencial")
               data = this.getMesaPresidencial[this.index];
            else if(this.title === "Redonda")
               data = this.getMesaRedonda[this.index];
            else if(this.title === "Cuartito")
               data = this.getMesaCuartito[this.index];
         }

         console.log("data", data);

         this.$emit("updateCurrSaleItem", data);
         this.$emit("updateCurrSelectedItem", {
            id: new_id,
            status: new_status,
            no_table: new_no_table,
            title: new_title,
            index: new_index
         });
      }
   }
};
</script>

<style lang="scss" scoped></style>
