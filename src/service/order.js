/**
 * author: Tsong
 * time: 2023/5/4 18:10
 */
import axios from "@/common/js/axios.js";

export function getOrderList(params) {
    return axios.get('/orders', {params})
}

export function getOrderDetail(id) {
    return axios.get(`/orders/${id}`)
}

export function checkDoneOrder(params) {
    return axios.put('/orders/checkDone', params)
}

export function checkOutOrder(params) {
    return axios.put('/orders/checkOut', params)
}

export function closeOrder(params) {
    return axios.put('/orders/close', params)
}
