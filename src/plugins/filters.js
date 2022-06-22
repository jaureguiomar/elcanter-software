import Vue from "vue";

Vue.filter("cutString", function (value, maxLength) {
   if(value.length > maxLength)
      return value.slice(0, maxLength).concat('...');
   else
      return value;
});
