/**
 * author: Tsong
 * time: 2023/5/4 17:32
 */
import axios from "@/common/js/axios.js";

export function getGoodsList(params) {
    return axios.get('/goods', {params})
}

export function getGoodsDetail(id) {
    return axios.get(`/goods/${id}`)
}

export function getGoodsCarousel(id) {
    return axios.get(`/goods/carousel/${id}`)
}

export function getGoodsName(id) {
    return axios.get(`/goods/name/${id}`)
}

export function addGoods(params) {
    return axios.post('/goods', params)
}

export function editGoods(params) {
    return axios.put('/goods', params)
}

export function editGoodsStatus(status, params) {
    return axios.put(`/goods/status/${status}`, params)
}

export function searchAllGoodsIdsAndNames() {
    return axios.get('/goods/all')
}
