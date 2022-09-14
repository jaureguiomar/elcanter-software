<template>
   <div class="item-container" :class="data.size">
      <div class="item-container-margin">
         <div class="item-container-content">
            <div
               v-for="(tmp_item_container, index) in data.item_containers"
               :key="data.typeContainer[index]"
            >
               <div v-if="data.title[index]" class="item-title">
                  <p>{{ data.title[index] }}</p>
               </div>
               <div :class="data.typeContainer[index]">
                  <TableItemElem
                     v-for="(tmp_no_table, index2) in data.noTables[index]"
                     :key="index2"
                     :fontSize="data.fontTables[index][index2]"
                     :idTable="data.idTables[index][index2]"
                     :statusTable="data.statusTables[index][index2]"
                     :noTable="data.noTables[index][index2]"
                     :currIdSelected="currIdSelected"
                     :index="index2"
                     :title="data.title[index]"
                     @updateCurrSaleItem="updateCurrSaleItem"
                     @updateCurrSelectedItem="updateCurrSelectedItem"
                  >
                     <template #no-table>{{ index2 + 1 }}</template>
                  </TableItemElem>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import compTableItem from "@/views/components/table/TableItem.vue";
export default {
   components: {
      TableItemElem: compTableItem
   },
   props: {
      data: {
         type: Object,
         required: true
      },
      currIdSelected: {
         type: Number,
         required: true
      }
   },
   data() {
      return {};
   },
   methods: {
      updateCurrSaleItem(newSale) {
         this.$emit("updateCurrSale", newSale);
      },
      updateCurrSelectedItem(newTableData) {
         this.$emit("updateCurrSelected", newTableData);
      }
   }
};
</script>

<style lang="scss" scoped></style>
