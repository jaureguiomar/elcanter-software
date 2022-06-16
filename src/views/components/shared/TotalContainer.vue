<template>
   <div class="totals-container">
      <div class="totals-container-margin">
         <div class="totals-container-content">
            <div class="totals-subtitle3">
               <div class="left-content">
                  <div class="left-content">
                     <i class="fa fa-cutlery fa-2x" aria-hidden="true"></i>
                     <font-awesome-icon icon="fa-solid fa-utensils" size="2x" />
                  </div>
                  <div class="right-content">
                     {{ (type == "table") ? "Mesa" : "Pedido" }}
                     no.
                     {{ (type == "table") ? data.mesa.nomesa : data.idpedido }}
                  </div>
               </div>
               <div class="right-content">
                  <button
                     @click="showOrderAddProducsModal"
                     :disabled="closed"
                     class="btn btn-custom"
                  >
                     <a href="#">
                        <font-awesome-icon icon="fa-solid fa-plus" />
                     </a>
                  </button>
               </div>
            </div>
            <!-- <div class="totals-subtitle">
               <div class="left-content">
                  <p>Informacion de la mesa</p>
               </div>
               <div class="right-content">
                  <button class="btn btn-custom">
                     <a href="#">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                     </a>
                  </button>
               </div>
            </div> -->
            <div class="totals-person">
               <p v-if="type == 'table'">
                  <span>{{ data.personas }}</span>
                  persona(s)
                  <span>{{ data.hora_inicio }}</span>
               </p>
               <p v-else>
                  Fecha: {{ data.hora_inicio }}
               </p>
            </div>
            <!-- <div class="totals-title">
               <h4>Mesa 4 - Presidencial</h4>
            </div> -->
            <div class="totals-data">
               <div class="left-content">
                  <p class="marked">Producto</p>
                  <p
                     v-for="(tmp_order, index) in data.comanda"
                     :key="'order-name-' + ((type == 'table') ? tmp_order.idventa : tmp_order.idpedido) + '-' + tmp_order.idproducto"
                  >
                     <span class="marked">({{ tmp_order.cantidad }})</span>
                     <a
                        @click="onQuantityPlusMinusClick($event, 'plus', index)"
                        class="link-plus"
                        :disabled="closed">
                        <font-awesome-icon icon="fa-solid fa-circle-plus" />
                     </a>
                     <a
                        @click="onQuantityPlusMinusClick($event, 'minus', index)"
                        class="link-minus"
                        :disabled="closed">
                        <font-awesome-icon icon="fa-solid fa-circle-minus" />
                     </a>
                     <a
                        @click="showAuthModal(index)"
                        class="link-minus"
                        :disabled="closed">
                        <font-awesome-icon icon="fa-solid fa-eraser" />
                     </a>
                     {{ tmp_order.producto.producto | curString(22) }}
                  </p>
               </div>
               <div class="right-content">
                  <p class="title">Precio</p>
                  <p
                     v-for="(tmp_comanda_price, index) in comanda_price"
                     :key="'order-total-' + ((type == 'table') ? tmp_comanda_price.idventa : tmp_comanda_price.idpedido) + '-' + tmp_comanda_price.idproducto"
                  >
                     <input
                        @keypress="onPriceChangeKeyUp($event, index)"
                        class="form-control mr-1"
                        type="text"
                        v-model="tmp_comanda_price.subtotal_modificado"
                        :disabled="closed">
                     <input
                        @keypress="onPriceChangeKeyUp($event, index)"
                        class="form-control"
                        type="text"
                        v-model="tmp_comanda_price.subtotal"
                        disabled>
                  </p>
               </div>
            </div>
            <div class="totals-total">
               <div class="left-content">
                  <h4>Total:</h4>
               </div>
               <div class="right-content">
                  <h4>${{ orderTotal }}</h4>
               </div>
            </div>
            <div class="totals-buttons">
               <button :disabled="closed" @click="showCloseOrderModal" class="btn btn-custom-totals-orange mb-1">
                  Cerrar
                  {{
                     (type == "table") ? "venta" : "pedido"
                  }}
               </button>
               <button @click="onReprintOrderClick" class="btn btn-custom-totals-outline mb-1">Reimprimir comanda</button>
            </div>

            <b-modal
               ref="auth-modal"
               title="Mensaje del sistema"
               header-class="modal-header-custom"
               body-class="modal-content-custom"
               content-class="modal-content-custom"
               dialog-class="modal-content-custom"
               footer-class="modal-footer-custom">
               <div class="form-group">
                  <label>Usuario administrador</label>
                  <input v-model="auth_modal.username" type="text" class="form-control" placeholder="Ingrese usuario administrador">
               </div>
               <div class="form-group">
                  <label>Contrase;a administrador</label>
                  <input v-model="auth_modal.password" type="password" class="form-control" placeholder="Ingrese contrase;a administrador">
               </div>
               <!-- <div class="form-group">
                  <label>Motivo</label>
                  <textarea v-model="auth_modal.text" class="form-control" placeholder="Ingrese motivo" rows="3"></textarea>
               </div> -->

               <template #modal-footer>
                  <button @click="hideAuthModal" class="btn btn-primary">Cancelar</button>
                  <button @click="confirmAuthModal" class="btn btn-warning">Confirmar</button>
               </template>
            </b-modal>
            <b-modal
               ref="close-order-modal"
               :title="((type == 'table') ? ('Venta no. ' + data.idventa) : ('Pedido no. ' + data.idpedido))"
               size="lg"
               header-class="modal-header-custom"
               body-class="modal-content-custom"
               content-class="modal-content-custom"
               dialog-class="modal-content-custom"
               footer-class="modal-footer-custom">
               <div class="container">
                   <div class="row">
                       <div class="col-md-6">
                           <div class="row">
                              <div class="col-md-12">
                                   <label>ADICIONES</label>
                              </div>
                              <div class="col-md-12">
                                   <ul class="list show items stated additions">
                                      <li
                                          v-for="(tmp_order) in data.comanda"
                                          :key="'close-order-data-' + ((type == 'table') ? tmp_order.idventa : tmp_order.idpedido) + '-' + tmp_order.idproducto"
                                       >
                                         <span class="mr-1">
                                            {{ tmp_order.cantidad }}
                                         </span>
                                         <strong class="mr-1">
                                              <strong>
                                                 {{ tmp_order.producto.producto }}
                                              </strong>
                                         </strong>
                                         <span class="mr-1">
                                            ${{
                                               (parseFloat(tmp_order.subtotal_modificado) != 0) ?
                                                   tmp_order.subtotal_modificado : tmp_order.subtotal
                                            }}
                                         </span>
                                         <span>
                                            (${{ tmp_order.producto.precio }} c/u)
                                         </span>
                                      </li>
                                      <!-- <li class="addition">
                                          <span>
                                             Subtotal
                                          </span>
                                      </li> -->
                                   </ul>
                              </div>
                              <div class="col-md-12">
                                   <ul class="list show items stated additions">
                                      <li>
                                         <span>
                                           TOTAL:
                                         </span>
                                         <span>
                                            ${{ orderTotal }}
                                         </span>
                                      </li>
                                   </ul>
                              </div>
                           </div>
                       </div>
                       <div class="col-md-6">
                           <div class="row">
                              <div class="col-md-12">
                                   <label>PAGO</label>
                              </div>
                              <div class="col-md-12">
                                   <div class="form-group row">
                                       <div class="col-sm-6">
                                           <select v-model="close_order_modal.payment_method" class="form-control form-control-sm">
                                               <option value="1">Efectivo</option>
                                               <option value="2">T. de Credito</option>
                                               <option value="3">T. de Débito</option>
                                           </select>
                                       </div>
                                       <div class="col-sm-6">
                                           <input v-model="close_order_modal.how_many" @keypress="onHowManyInputKeypress" @blur="onHowManyInputBlur" type="text" class="form-control form-control-sm">
                                       </div>
                                   </div>
                              </div>
                           </div>
                           <div class="row pt-5">
                              <div class="col-md-6">
                                   <label>VUELTO</label>
                              </div>
                              <div class="col-md-6 text-right">
                                   <label>${{ close_order_modal.change }}</label>
                              </div>
                           </div>
                       </div>
                   </div>
               </div>

               <template #modal-footer>
                  <button @click="hideCloseOrderModal" class="btn btn-primary">Cancelar</button>
                  <button @click="closeOrderModal" class="btn btn-warning">
                     Cerrar
                     {{
                        (type == "table") ? "venta" : "pedido"
                     }}
                  </button>
               </template>
            </b-modal>
            <b-modal
               ref="order-add-products-modal"
               :title="((type == 'table') ? ('Venta no. ' + data.idventa) : ('Pedido no. ' + data.idpedido))"
               size="xl"
               header-class="modal-header-custom"
               body-class="modal-content-custom"
               content-class="modal-content-custom"
               dialog-class="modal-content-custom"
               footer-class="modal-footer-custom">
               <div class="container">
                  <div class="row">
                     <div class="col-md-8">
                        <div class="add-product-container">
                           <div class="header mb-2">
                              <label>Adicionar</label>
                           </div>
                           <div class="body">
                              <div class="table-responsive">
                                 <table class="table table-striped table-hover">
                                    <thead>
                                       <tr>
                                          <td>Cant.</td>
                                          <td>Producto</td>
                                          <td>Precio Unitario</td>
                                          <td>Comentario</td>
                                          <td>Subtotal</td>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr
                                        v-for="tmp_product in order_add_products_modal.product_selected"
                                        :key="'add-product-table-data-' + tmp_product.idproducto"
                                       >
                                          <td>
                                             <input @blur="orderAddProductscalculateTotal" @keyup="orderAddProductscalculateTotal" v-model="tmp_product.cantidad" class="form-control-sm" type="text"  style="width: 50px;">
                                          </td>
                                          <td>{{ tmp_product.producto }}</td>
                                          <td>{{ tmp_product.precio }}</td>
                                          <td>
                                             <textarea v-model="tmp_product.comment" class="form-control" rows="3" placeholder="Ingresa comentario (opcional)" style="width: 240px;">
                                             </textarea>
                                          </td>
                                          <td>${{ tmp_product.precio }}</td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                              <!-- <div class="col-md-12 text-right">
                                 <button class="btn btn-sm btn-primary">
                                    Mandar
                                    {{
                                       (type == "table") ? "venta" : "pedido"
                                    }}
                                 </button>
                              </div> -->
                              <div class="col-md-12 pt-2 text-right">
                                 <h1>Total: <label>${{ order_add_products_modal.total }}</label></h1>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="col-md-4">
                        <div class="add-product-container">
                           <div class="header mb-2">
                              <label>Adicionado</label>
                           </div>
                           <div class="body">
                              <div class="search-input mb-2">
                                 <div class="left-content">
                                    <input
                                       v-model="order_add_products_modal.product_search"
                                       list="add-product-search-input"
                                       placeholder="Buscar un producto"
                                       class="form-control"
                                       type="text"
                                    >
                                    <datalist id="add-product-search-input">
                                       <!-- <option>Selecciona un producto</option> -->
                                       <option
                                          v-for="tmp_product in order_add_products_modal.product"
                                          :key="'add-product-search-product' + tmp_product.idproducto"
                                       >
                                          {{ tmp_product.producto }}
                                       </option>
                                    </datalist>
                                 </div>
                                 <div class="right-content">
                                    <button
                                       @click="onAddOrderProductClick"
                                       class="btn btn-primary"
                                       type="button">
                                       <font-awesome-icon icon="fa-solid fa-plus" />
                                    </button>
                                 </div>
                              </div>
                              <div class="items-container">
                                 <ul>
                                    <li
                                       v-for="tmp_product in data.comanda"
                                       :key="'selected-order-products-' + tmp_product.idproducto"
                                    >
                                       <div class="left-content">
                                          <span class="items-quantity">{{ tmp_product.cantidad }}</span>
                                          <span class="items-name">{{ tmp_product.producto.producto }}</span>
                                       </div>
                                       <div class="right-content">
                                          <span class="items-subtotal">
                                             ${{
                                                (parseFloat(tmp_product.subtotal_modificado) != "0") ?
                                                   tmp_product.subtotal_modificado : tmp_product.subtotal
                                             }}
                                          </span>
                                       </div>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <template #modal-footer>
                  <button @click="hideOrderAddProducsModal" class="btn btn-success">Cancelar</button>
                  <button @click="addOrderAddProductsModal" class="btn btn-primary">
                     Agregar a
                     {{
                        (type == "table") ? "venta" : "pedido"
                     }}
                  </button>
               </template>
            </b-modal>
         </div>
      </div>
   </div>
</template>

<script>
import Vue from "vue";
const querystring = require("querystring");

export default {
   props: {
      data: {
         type: Object,
         required: true
      },
      type: {
         type: String,
         required: true
      }
   },
   data() {
      return {
         comanda_price: [],
         closed: false,
         auth_modal: {
            curr_index: -1,
            username: "",
            password: "",
            text: ""
         },
         close_order_modal: {
            payment_method: "1",
            how_many: "0.00",
            change: "0.00"
         },
         order_add_products_modal: {
            product_search: "",
            product: [],
            product_selected: [],
            total: "0.00"
         }
      };
   },
   methods: {
      onQuantityPlusMinusClick(e, type, index) {
         e.preventDefault();
         const vue_this = this;
         const curr_order = this.data.comanda[index];
         const price = parseFloat(curr_order.precio);
         let quantity = parseFloat(curr_order.cantidad);
         let new_subtotal = 0;

         if(this.closed)
            return;

         if(type == "plus") {
            quantity ++;
         } else {
            quantity --;
            if(quantity < 1)
               quantity = 1;
         }
         new_subtotal = parseFloat(price * quantity).toFixed(2);

         Vue.prototype.$http.post(this.getComandaSourcePath() + "/edit/" + ((this.type == "table") ? curr_order.comanda : curr_order.comanda_pedido),
            querystring.stringify({
               cantidad: quantity,
               subtotal: new_subtotal
            }),
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         )
         .then(function (response) {
               if(response) {
                  const data = response.data;
                  if(data == 1) {
                     vue_this.$emit("updateOrderComandaField", {
                        index: index,
                        field: "cantidad",
                        value: quantity
                     });
                     vue_this.$emit("updateOrderComandaField", {
                        index: index,
                        field: "subtotal",
                        value: new_subtotal
                     });
                     vue_this.comanda_price[index].subtotal = new_subtotal;
                  } else {
                     alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
                  }
               } else {
                  alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
               }
            });
      },
      onPriceChangeKeyUp(e, index) {
         if(e.which == 13) {
            this.comanda_price[index].subtotal_modificado = parseFloat(this.comanda_price[index].subtotal_modificado).toFixed(2);
            if(isNaN(this.comanda_price[index].subtotal_modificado))
               this.comanda_price[index].subtotal_modificado = "0.00";

            const vue_this = this;
            const curr_comanda_price = this.comanda_price[index];
            Vue.prototype.$http.post(this.getComandaSourcePath() + "/edit/" + ((this.type == "table") ? curr_comanda_price.comanda : curr_comanda_price.comanda_pedido),
               querystring.stringify({
                  subtotal_modificado: curr_comanda_price.subtotal_modificado
               }),
               {
                  responseType: "text",
                  headers: {
                     "X-Requested-With": "XMLHttpRequest",
                     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                  }
               }
            )
            .then(function (response) {
                  if(response) {
                     const data = response.data;
                     if(data == 1) {
                        vue_this.$emit("updateOrderComandaField", {
                           index: index,
                           field: "subtotal_modificado",
                           value: curr_comanda_price.subtotal_modificado
                        });
                     } else {
                        alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
                     }
                  } else {
                     alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
                  }
               });
         }
      },
      showAuthModal(index) {
         if(this.closed)
            return;

         this.auth_modal.curr_index = index;
         this.clearAuthModal();
         this.$refs["auth-modal"].show();
      },
      confirmAuthModal() {
         if(this.auth_modal.curr_index == -1)
            return;

         const vue_this = this;
         const curr_order = this.data.comanda[this.auth_modal.curr_index];
         const username = this.auth_modal.username;
         const password = this.auth_modal.password;
         // const text = this.auth_modal.text;

         Vue.prototype.$http.post(this.getComandaSourcePath() + "/delete/" + ((this.type == "table") ? curr_order.comanda : curr_order.comanda_pedido),
            querystring.stringify({
               usuario: username,
               clave: password
            }),
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         )
         .then(function (response) {
            if(response) {
               const data = response.data;
               if(data == 1) {
                  vue_this.$emit("removeOrderComanda", vue_this.auth_modal.curr_index);
                  vue_this.comanda_price.splice(vue_this.auth_modal.curr_index, 1);

                  vue_this.hideAuthModal();
                  vue_this.auth_modal.curr_index = -1;
               } else {
                  alert("Usuario y/o contrase;a incorrecto");
               }
            } else {
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            }
         });
      },
      hideAuthModal() {
         this.$refs["auth-modal"].hide();
      },
      clearAuthModal() {
         this.auth_modal.username = "";
         this.auth_modal.password = "";
         this.auth_modal.text = "";
      },
      showCloseOrderModal() {
         this.close_order_modal.how_many = this.orderTotal;
         this.$refs["close-order-modal"].show();
      },
      onReprintOrderClick() {
         this.printData(this.data);
      },
      calculateHowMany() {
         this.close_order_modal.how_many = parseFloat(this.close_order_modal.how_many).toFixed(2);
         if(isNaN(this.close_order_modal.how_many))
            this.close_order_modal.how_many = "0.00";
      },
      calculateChange() {
         let total = parseFloat(this.orderTotal);
         let how_many = parseFloat(this.close_order_modal.how_many);
         let change = parseFloat(how_many - total).toFixed(2);
         this.close_order_modal.change = change;
         let error_change = false;

         if(how_many < total)
            error_change = true;
         return error_change;
      },
      closeOrderModal() {
         const vue_this = this;
         const type_source_path = this.getTypeSourcePath();
         let type_source_endpoint = "";
         let params = {};

         if(this.calculateChange()) {
            alert("El monto de pago debe ser mayor o igual al total");
            return;
         }

         if(type_source_path == "Ventas")
            type_source_endpoint = "termina_mesa";
         else
            type_source_endpoint = "termina_pedido";

         if(this.type == "table")
            params = {
               status: 2,
               total: this.orderTotal,
               metodo_pago: this.close_order_modal.payment_method,
               propina: 0,
               monto_propina: 0,
               porcentaje_propina: 0,
               cuanto_pago: this.close_order_modal.how_many,
               cambio: this.close_order_modal.change,
               idmesa: this.data.idmesa
            };
         else
            params = {
               status: 2,
               total: this.orderTotal,
               metodo_pago: this.close_order_modal.payment_method,
               cuanto_pago: this.close_order_modal.how_many,
               cambio: this.close_order_modal.change
            };

         Vue.prototype.$http.post(type_source_path + "/" + type_source_endpoint + "/" + ((this.type == "table") ? this.data.idventa : this.data.idpedido),
            querystring.stringify(params),
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         )
         .then(function (response) {
            if(response) {
               const data = response.data;
               if(data) {
                  if(vue_this.type == "table") {
                     vue_this.$emit("updateTableStatus", 1);
                     vue_this.$emit("updateCurrSelected", {
                        id: -1,
                        status: -1,
                        no_table: -1
                     });
                  } else {
                     let new_status = "";
                     if(data.pedido.status == 1)
                        new_status = "Abierto";
                     else
                        new_status = "Cerrado";

                     vue_this.$emit("updateOrderField", {
                        field: "status",
                        value: new_status
                     });
                     vue_this.$emit("updateOrderField", {
                        field: "total",
                        value: vue_this.orderTotal
                     });
                  }

                  vue_this.printData(vue_this.data);
                  vue_this.closed = true;
                  vue_this.hideCloseOrderModal();
               } else {
                  alert("Usuario y/o contrase;a incorrecto");
               }
            } else {
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            }
         });
      },
      hideCloseOrderModal() {
         this.$refs["close-order-modal"].hide();
      },
      onHowManyInputKeypress(e) {
         if(e.keyCode === 13) {
            this.calculateHowMany();
            this.calculateChange();
         }
      },
      onHowManyInputBlur() {
         this.calculateHowMany();
         this.calculateChange();
      },
      showOrderAddProducsModal() {
         this.order_add_products_modal.product_selected = [];
         this.orderAddProductscalculateTotal();
         if(this.closed)
            return;

         const vue_this = this;
         Vue.prototype.$http.get("Productos/get_like/", {}, {
            responseType: "json",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         })
         .then(function (response) {
            if(response) {
               const data = response.data;
               vue_this.order_add_products_modal.product = data;
               vue_this.$refs["order-add-products-modal"].show();
            } else {
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            }
         });
      },
      onAddOrderProductClick() {
         const product_name = this.order_add_products_modal.product_search;
         let finded = false;
         let finded_product = null;

         for(let i = 0; i < this.order_add_products_modal.product.length; i++) {
            const curr_product = this.order_add_products_modal.product[i];
            if(product_name == curr_product.producto) {
               finded = true;
               finded_product = curr_product;
               break;
            }
         }

         if(!finded) {
            alert("El producto ingresado es incorrecto");
            return;
         }

         // Verify if product already selected
         finded = false;
         for(let i = 0; i < this.order_add_products_modal.product_selected.length; i++) {
            const curr_product = this.order_add_products_modal.product_selected[i];
            if(product_name == curr_product.producto) {
               finded = true;
               break;
            }
         }
         if(finded) {
            this.order_add_products_modal.product_search = "";
            alert("El producto ya fue agregado al pedido");
            return;
         }

         // Verify if product already in order
         finded = false;
         for(let i = 0; i < this.data.comanda.length; i++) {
            const curr_comanda = this.data.comanda[i];
            const curr_product = curr_comanda.producto;
            if(product_name == curr_product.producto) {
               finded = true;
               break;
            }
         }
         if(finded) {
            this.order_add_products_modal.product_search = "";
            alert("El producto ya fue agregado al pedido");
            return;
         }

         if(this.type == "table")
            finded_product.idventa = this.data.idventa;
         else
            finded_product.idpedido = this.data.idpedido;
         finded_product.cantidad = 1;
         finded_product.comment = "";
         this.order_add_products_modal.product_selected.push(finded_product);
         this.order_add_products_modal.product_search = "";
         this.orderAddProductscalculateTotal();
      },
      orderAddProductscalculateTotal() {
         let total = 0;
         for(let i = 0; i < this.order_add_products_modal.product_selected.length; i++) {
            const curr_product = this.order_add_products_modal.product_selected[i];
            let curr_quantity = parseInt(curr_product.cantidad);
            let curr_price = parseFloat(curr_product.precio);
            let tmp_total = 0;

            if(isNaN(curr_quantity))
               curr_quantity = 0;
            if(isNaN(curr_price))
               curr_price = 0;

            tmp_total = curr_quantity * curr_price;
            total += tmp_total;
            this.order_add_products_modal.product_selected[i].subtotal = tmp_total.toFixed(2);
            this.order_add_products_modal.product_selected[i].subtotal_modificado = "0.00";
         }

         if(isNaN(total))
            total = 0;
         if(total <= 0)
            total = "0.00";

         this.order_add_products_modal.total = parseFloat(total).toFixed(2);
      },
      async addOrderAddProductsModal() {
         if(this.order_add_products_modal.product_selected.length <= 0) {
            alert("La comanda al menos debe de tener almenos un producto");
            return;
         }

         // Insert order products
         let response = null;
         response = await Vue.prototype.$http.post(this.getComandaSourcePath() + "/insert",
            querystring.stringify({
               comanda: JSON.stringify(this.order_add_products_modal.product_selected)
            }),
            {
               responseType: "text",
               headers: {
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
               }
            }
         );
         if(response) {
            const data = response.data;
            if(!data) {
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
               return;
            }
         } else {
            alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            return;
         }

         // Get sale / order
         response = null;
         response = await Vue.prototype.$http.post(this.getTypeSourcePath() + "/get_by_id/" + ((this.type == "table") ? this.data.idventa : this.data.idpedido), {},
         {
            responseType: "text",
            headers: {
               "X-Requested-With": "XMLHttpRequest",
               "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
         });
         if(response) {
            const data = response.data;
            if(!data) {
               alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
               return;
            }

            this.printData(data);
            this.$emit("updateOrder", data);
            this.$refs["order-add-products-modal"].hide();
         } else {
            alert("Ha ocurrido un error inesperado. Por favor, intenta de nuevo.");
            return;
         }
      },
      hideOrderAddProducsModal() {
         this.$refs["order-add-products-modal"].hide();
      },
      getTypeSourcePath() {
         let source_url = "";
         if(this.type == "table")
            source_url = "Ventas";
         else
            source_url = "Pedidos";
         return source_url;
      },
      getComandaSourcePath() {
         let source_url = "";
         if(this.type == "table")
            source_url = "Comandas";
         else
            source_url = "ComandasPedidos";
         return source_url;
      },
      printData(data) {
         if(this.type == "table")
            window.api.send("printer-table", data);
         else
            window.api.send("printer-order", data);
      }
   },
   computed: {
      orderTotal() {
         let total = 0;
         if(this.data.comanda) {
            for(let i = 0; i < this.data.comanda.length; i++) {
               const curr_order = this.data.comanda[i];
               const subtotal = parseFloat(curr_order.subtotal).toFixed(2);
               const subtotal_modificado = parseFloat(curr_order.subtotal_modificado).toFixed(2);
               if(subtotal_modificado == 0)
                  total += parseFloat(subtotal);
               else
                  total += parseFloat(subtotal_modificado);
            }
         }

         if(isNaN(total))
            total = -1;
         else
            total = total.toFixed(2);
         return total;
      }
   },
   watch: {
      data() {
         if(this.data.status == 2)
            this.closed = true;
         else
            this.closed = false;

         this.comanda_price = [];
         for(let i = 0; i < this.data.comanda.length; i++) {
            const curr_order = this.data.comanda[i];
            const subtotal = parseFloat(curr_order.subtotal).toFixed(2);
            const subtotal_modificado = parseFloat(curr_order.subtotal_modificado).toFixed(2);

            if(this.type == "table") {
               this.comanda_price.push({
                  idventa: curr_order.idventa,
                  idproducto: curr_order.idproducto,
                  comanda: curr_order.comanda,
                  subtotal: subtotal,
                  subtotal_modificado: subtotal_modificado
               });
            } else {
               this.comanda_price.push({
                  idpedido: curr_order.idpedido,
                  idproducto: curr_order.idproducto,
                  comanda_pedido: curr_order.comanda_pedido,
                  subtotal: subtotal,
                  subtotal_modificado: subtotal_modificado
               });
            }
         }
      }
   }
};
</script>

<style lang="scss">
   .modal-content-custom {
      background: rgb(52, 50, 49) !important;
   }
   .modal-header-custom {
      border-bottom: 1px solid rgb(112, 112, 112) !important;
   }
   .modal-footer-custom {
      border-top: 1px solid rgb(112, 112, 112) !important;
   }
   .table th, .table td {
      border-top: none !important;
   }
   .table-responsive {
      max-height: 400px;
      overflow-y: auto;
   }

   .add-product-container {
      width: 100%;
      height: auto;
      .header {
         width: 100%;
         height: auto;
         border: 1px solid #ccc;
         padding: 7px;
         border-radius: 5px;
         label {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
         }
      }
      .body {
         width: 100%;
         height: auto;
         .search-input {
            display: flex;
            flex-direction: row;
            align-items: center;
            .left-content {
               width: 100%;
               input {
                  width: 100%;
                  border-radius: 2px !important;
                  border: 1px solid #ccc !important;
                  border-top-right-radius: 0px !important;
                  border-bottom-right-radius: 0px !important;
               }
            }
            .right-content {
               button {
                  border-top-left-radius: 0px !important;
                  border-bottom-left-radius: 0px !important;
               }
            }
         }
         .items-container {
            max-height: 400px;
            overflow-y: auto;

            ul {
               margin: 0;
               padding: 0;
               list-style: none;
               li {
                  padding: 10px;
                  border: 1px solid #ccc;
                  font-size: 14px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  &:hover {
                     background: rgba(112, 112, 112, 0.59);
                  }
                  .left-content {
                     .items-quantity {
                        margin-right: 10px;
                        font-weight: bold;
                     }
                     .items-name {
                        margin-right: 4px;
                        font-size: 12px;
                     }
                  }
                  // .right {
                  //    .items-subtotal {
                  //    }
                  // }
               }
            }
         }
      }
   }
</style>
