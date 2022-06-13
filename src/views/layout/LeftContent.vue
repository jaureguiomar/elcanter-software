<template>
   <div class="content-left">
      <div class="content-left-margin">
         <div class="content-left-content">
            <div class="content-title">
               <div class="content-title-margin">
                  <div class="content-title-content">
                     <slot name="title"></slot>
                  </div>
               </div>
            </div>

            <div class="content-content">
               <div class="content-content-margin">
                  <div class="content-content-content">
                     <slot name="content"></slot>
                  </div>
               </div>
            </div>

            <slot name="footer"></slot>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   data() {
      return {};
   },
};
</script>

<style lang="scss" scoped></style>
