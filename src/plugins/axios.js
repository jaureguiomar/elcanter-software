import Vue from "vue";
import axios from "axios";

const api = axios.create({
   // baseURL: "http://127.0.0.1/elcanter/",
   // baseURL: "http://127.0.0.1:9010/elcanter/",
   baseURL: "https://elcantererorestaurante.com/",
   timeout: 100000
});

Vue.prototype.$http = api;
