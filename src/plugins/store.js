import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const store = new Vuex.Store({
   state: {
      mesa: {
         barra: [],
         cocina: [],
         cuartito: [],
         patio1: [],
         patio2: [],
         presidencial: [],
         redonda: []
      },
      corte: {
         last: null
      },
      is_online: true,
   },
   getters: {
      getMesaBarra(state) {
         return state.mesa.barra;
      },
      getMesaCocina(state) {
         return state.mesa.cocina;
      },
      getMesaCuartito(state) {
         return state.mesa.cuartito;
      },
      getMesaPatio1(state) {
         return state.mesa.patio1;
      },
      getMesaPatio2(state) {
         return state.mesa.patio2;
      },
      getMesaPresidencial(state) {
         return state.mesa.presidencial;
      },
      getMesaRedonda(state) {
         return state.mesa.redonda;
      },
      getCorteLast(state) {
         return state.corte.last;
      },
      getIsOnline(state) {
         return state.is_online;
      }
   },
   mutations: {
      SET_MESA_BARRA: (state, data) => {
         state.mesa.barra = data;
      },
      // SET_MESA_BARRA_DATA: (state, data) => {
      //    state.mesa.barra[data.index] = {
      //       cambio: data.cambio,
      //       comanda: data.comanda,
      //       corte_id: data.corte_id,
      //       cuanto_pago: data.cuanto_pago,
      //       fecha_final: data.fecha_final,
      //       hora_final: data.hora_final,
      //       hora_inicio: data.hora_inicio,
      //       idmesa: data.idmesa,
      //       idmesero: data.idmesero,
      //       idventa: data.idventa,
      //       is_sync: data.is_sync,
      //       mesa: data.mesa,
      //       mesero: data.mesero,
      //       metodo_pago: data.metodo_pago,
      //       monto_propina: data.monto_propina,
      //       personas: data.personas,
      //       porcentaje_propina: data.porcentaje_propina,
      //       propina: data.propina,
      //       status: data.status,
      //       total: data.total
      //    };
      // },
      // SET_MESA_BARRA_STATUS: (state, data) => {
      //    state.mesa.barra[data.index].status = data;
      // },
      SET_MESA_BARRA_COMANDA: (state, data) => {
         state.mesa.barra[data.index].comanda = data.comanda;
      },
      SET_MESA_COCINA: (state, data) => {
         state.mesa.cocina = data;
      },
      SET_MESA_CUARTITO: (state, data) => {
         state.mesa.cuartito = data;
      },
      SET_MESA_PATIO1: (state, data) => {
         state.mesa.patio1 = data;
      },
      SET_MESA_PATIO2: (state, data) => {
         state.mesa.patio2 = data;
      },
      SET_MESA_PRESIDENCIAL: (state, data) => {
         state.mesa.presidencial = data;
      },
      SET_MESA_REDONDA: (state, data) => {
         state.mesa.redonda = data;
      },
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
