/**
 * author: Tsong
 * time: 2023/5/4 18:15
 */
import axios from "@/common/js/axios.js";

export function getSeckillList(params) {
    return axios.get('/seckill', {params})
}

export function getSeckillDetail(id) {
    return axios.get(`/seckill/${id}`)
}

export function addSeckill(params) {
    return axios.post('/seckill', params)
}

export function editSeckill(params) {
    return axios.put('/seckill', params)
}

export function deleteSeckill(id) {
    return axios.delete(`/seckill/${id}`)
}
