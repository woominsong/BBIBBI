import Vue from 'vue'
import App from './App.vue'
import router from './routes/AppRouter'
import axios from 'axios'

import io from 'socket.io-client'; 
const socket = io('http://localhost:3000'); 

Vue.prototype.$socket = socket;
Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.use(require('vue-cookie'))

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
