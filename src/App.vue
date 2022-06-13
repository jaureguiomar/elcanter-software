<template>
   <div id="app">
      <div class="site-container">
        <div class="site-container-margin">
            <div class="site-container-content">
               <RouterView />
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
  }
};
</script>

<style lang="scss" scoped></style>
