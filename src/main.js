import Vue from 'vue'
import App from './App.vue'
import router from './routes/AppRouter'
import axios from 'axios'
//import cookie from 'vue-cookie';

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.use(require('vue-cookie'))

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
