<template>
   <div class="header-container">
      <div class="header-container-margin">
         <div class="header-container-content">
            <div class="menu-content">
               <router-link :class="{ 'active': currRoute == 'table' }" to="/">Mesas</router-link>
               <router-link :class="{ 'active': currRoute == 'order' }" to="/order">Pedidos</router-link>
               <router-link :class="{ 'active': currRoute == 'waiter' }" to="/waiter">Meseros</router-link>
               <router-link :class="{ 'active': currRoute == 'sale-history' }" to="/sale-history">Historial de ventas</router-link>
            </div>
            <div class="logo-content">
               <img src="../../assets/img/elcanter-logo.png">
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {};
   },
   computed: {
      currRoute() {
         return this.$route.name;
      }
   }
};
</script>

<style lang="scss" scoped></style>
