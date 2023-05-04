/**
 * author: Tsong
 * time: 2023/5/4 18:19
 */
import axios from "@/common/js/axios.js";

export function uploadFile(params) {
    return axios.post('/upload/file', params)
}

export function uploadFiles() {
    return axios.post('/upload/files')
}
