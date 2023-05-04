/**
 * author: Tsong
 * time: 2023/5/4 15:32
 */
import axios from "@/common/js/axios"

export function getCategory(params) {
    return axios.get('/categories', {params})
}

export function getCategoryDetail(id) {
    return axios.get(`/categories/${id}`)
}

export function getCategories4Select(params) {
    return axios.get('/categories4Select', {params})
}

export function addCategory(params) {
    return axios.post('/categories', params)
}

export function editCategory(params) {
    return axios.put('/categories', params)
}

export function deleteCategory(params) {
    return axios.delete('/categories', {params})
}
