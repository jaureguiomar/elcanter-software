import Vue from "vue";
import VueRouter from "vue-router";
import Table from "@/views/Table.vue";
import Sale from "@/views/Sale.vue";
import Order from "@/views/Order.vue";
import Waiter from "@/views/Waiter.vue";
import SaleHistory from "@/views/SaleHistory.vue";

const routes = [
   { path: "/", component: Table, name: "table" },
   { path: "/sale", component: Sale, name: "sale" },
   { path: "/order", component: Order, name: "order" },
   { path: "/waiter", component: Waiter, name: "waiter" },
   { path: "/sale-history", component: SaleHistory, name: "sale-history" }
];

Vue.use(VueRouter);
const router = new VueRouter({
   routes: routes,
   mode: "hash",
});

export default router;
