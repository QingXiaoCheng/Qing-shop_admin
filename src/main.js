import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/commen.css'
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (from.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('token')) {
    next()
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
