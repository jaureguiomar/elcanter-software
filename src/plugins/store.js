import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
   state: {
      corte: {
         last: null
      },
      is_online: true,
   },
   getters: {
      getCorteLast(state) {
         return state.corte.last;
      },
      getIsOnline(state) {
         return state.is_online;
      }
   },
   mutations: {
      SET_CORTE_LAST: (state, data) => {
         state.corte.last = data;
      },
      SET_CORTE_CLOSE: (state, data) => {
         state.corte.last = {
            amount_end: data.amount_end,
            amount_order: data.amount_order,
            amount_sale: data.amount_sale,
            amount_start: state.corte.last.amount_start,
            created: state.corte.last.created,
            date_close: data.date_close,
            id: state.corte.last.id,
            is_active: state.corte.last.is_active,
            is_sync: state.corte.last.is_sync,
            status: data.status,
            updated: state.corte.last.updated,
            waiter_close: data.waiter_close,
            waiter_open: state.corte.last.waiter_open
         }
      },
      SET_IS_ONLINE_DATA: (state, data) => {
         state.is_online = data;
      }
   }
});

export default store;
