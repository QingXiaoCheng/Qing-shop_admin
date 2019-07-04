import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/commen.css'
Vue.use(ElementUI)
import axios from 'axios'
Vue.prototype.$http = axios

// 首先解决baseURL的问题
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

axios.interceptors.request.use(function(config) {
  // console.log(config)

  config.headers.Authorization = localStorage.getItem('token')
  return config
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
