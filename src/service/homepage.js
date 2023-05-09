/**
 * author: Tsong
 * time: 2023/5/4 18:02
 */
import axios from "@/common/js/axios.js";

export function getHomepage(params) {
    return axios.get('/homepage', {params})
}

export function getHomepageDetail(id) {
    return axios.get(`/homepage/${id}`)
}

export function addHomepage(params) {
    return axios.post('/homepage', params)
}

export function editHomepage(params) {
    return axios.put('/homepage', params)
}

export function deleteHomepage(params) {
    return axios.post('/homepage/delete', params)
}
