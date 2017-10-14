
import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify'





Vue.use(VueResource);
Vue.use(Vuetify);




new Vue({

  el: '#app',
  render: h => h(App)


})

