import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
   state: {
      is_online: true,
   },
   getters: {
      getIsOnline(state) {
         return state.is_online;
      }
   },
   mutations: {
      SET_IS_ONLINE_DATA: (state, data) => {
         state.is_online = data;
      }
   }
});

export default store;
