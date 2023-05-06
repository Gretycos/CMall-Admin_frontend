/**
 * author: Tsong
 * time: 2023/5/4 17:21
 */
import axios from "@/common/js/axios.js";

export function getCarouselList(params) {
    return axios.get('/carousels', {params})
}

export function getCarouselDetail(id) {
    return axios.get(`/carousels/${id}`)
}

export function addCarousel(params) {
    return axios.post('/carousels', params)
}

export function editCarousel(params) {
    return axios.put('/carousels', params)
}

export function deleteCarousel(params) {
    return axios.delete('/carousels', {params})
}
