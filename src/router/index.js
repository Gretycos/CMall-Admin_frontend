/**
 * author: Tsong
 * time: 2023/5/4 15:27
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import {getLocal} from "@/common/js/utils.js";

const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import(/* webpackChunkName: "introduce" */ '../views/Statistic.vue')
        },
        {
            path: '/add',
            name: 'add',
            component: () => import(/* webpackChunkName: "add" */ '../views/AddGoods.vue')
        },
        {
            path: '/addSeckill',
            name: 'addSeckill',
            component: () => import(/* webpackChunkName: "add" */ '../views/AddSeckill.vue')
        },
        {
            path: '/carousel',
            name: 'carousel',
            component: () => import(/* webpackChunkName: "swiper" */ '../views/Carousel.vue')
        },
        {
            path: '/hot',
            name: 'hot',
            component: () => import(/* webpackChunkName: "hot" */ '../views/HomepageConfig.vue')
        },
        {
            path: '/new',
            name: 'new',
            component: () => import(/* webpackChunkName: "new" */ '../views/HomepageConfig.vue')
        },
        {
            path: '/recommend',
            name: 'recommend',
            component: () => import(/* webpackChunkName: "recommend" */ '../views/HomepageConfig.vue')
        },
        {
            path: '/seckill',
            name: 'seckill',
            component: () => import(/* webpackChunkName: "recommend" */ '../views/Seckill.vue')
        },
        {
            path: '/category',
            name: 'category',
            component: () => import(/* webpackChunkName: "category" */ '../views/Category.vue'),
            children: [
                {
                    path: '/category/level2',
                    name: 'level2',
                    component: () => import(/* webpackChunkName: "level2" */ '../views/Category.vue'),
                },
                {
                    path: '/category/level3',
                    name: 'level3',
                    component: () => import(/* webpackChunkName: "level3" */ '../views/Category.vue'),
                }
            ]
        },
        {
            path: '/goods',
            name: 'goods',
            component: () => import(/* webpackChunkName: "new" */ '../views/Goods.vue')
        },
        {
            path: '/guest',
            name: 'guest',
            component: () => import(/* webpackChunkName: "guest" */ '../views/Guest.vue')
        },
        {
            path: '/order',
            name: 'order',
            component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
        },
        {
            path: '/order_detail',
            name: 'order_detail',
            component: () => import(/* webpackChunkName: "order_detail" */ '../views/OrderDetail.vue')
        },
        {
            path: '/account',
            name: 'account',
            component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    // console.log(to)
    if (!getLocal('token') && to.path !== '/login'){
        // console.log('去登录界面')
        next({path: '/login'})
    } else {
        // console.log('去下个界面')
        next()
    }
})

export default router
