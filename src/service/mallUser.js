/**
 * author: Tsong
 * time: 2023/5/4 18:08
 */
import axios from "@/common/js/axios.js";

export function getMallUser(params) {
    return axios.get('/users', {params})
}

export function editMallUser(status, params) {
    return axios.put(`/users/${status}`, params)
}
