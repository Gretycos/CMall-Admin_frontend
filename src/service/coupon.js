/**
 * author: Tsong
 * time: 2023/5/4 17:25
 */
import axios from "@/common/js/axios.js";

export function getCouponList(params) {
    return axios.get('/coupon', {params})
}

export function getCouponDetail(id) {
    return axios.get(`/coupon/${id}`)
}

export function addCoupon(params) {
    return axios.post('/coupon', params)
}

export function editCoupon(params) {
    return axios.put('/coupon', params)
}

export function deleteCoupon(id) {
    return axios.delete(`/coupon/${id}`)
}
