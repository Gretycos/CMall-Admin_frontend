/**
 * author: Tsong
 * time: 2023/5/4 18:21
 */
import axios from "@/common/js/axios.js";

export function getProfile() {
    return axios.get('/adminUser/profile')
}

export function login(params) {
    return axios.post('/adminUser/login', params)
}

export function editPassword(params) {
    return axios.put('/adminUser/password', params)
}

export function editName(params) {
    return axios.put('/adminUser/name', params)
}

export function logout() {
    return axios.delete('/adminUser/logout')
}
