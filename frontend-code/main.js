import Vue from 'vue';
import App from './src/App.vue';
import VueRouter from 'vue-router';  
// Vue.createApp(App).mount('#app');
import { routes } from './src/router/index'

Vue.use(VueRouter);

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

var app = new Vue({
    el: '#app',
    router,
    render: (h) => h(App) 
  })