import Vue from 'vue';
import App from './src/App.vue';
import VueRouter from 'vue-router';  
// Vue.createApp(App).mount('#app');
import { routes } from './src/router/index'
import Vuex from 'vuex'
import { stores } from './src/store/index'

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  mode: 'history',
  routes // (缩写) 相当于 routes: routes
})

const store = new Vuex.Store(stores);

var app = new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App) 
  })