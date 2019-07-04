import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Home from './views/Home/Home.vue'
import User from './views/User/user.vue'
import Roles from './views/Roles/roles.vue'
import Rights from './views/Rights/rights.vue'
import Goods from './views/Goods/goods.vue'
import Categories from './views/Goods/categories.vue'
import GoodsAdd from './views/Goods/goodsAdd.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: User },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})
