import Vue from 'vue';
import App from './src/App.vue';
  
// Vue.createApp(App).mount('#app');

var app = new Vue({
    el: '#app',
    render: (h) => h(App) 
  })