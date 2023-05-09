/**
 * author: Tsong
 * time: 2023/5/4 18:19
 */
import axios from "@/common/js/axios.js";

export function deleteFiles(params) {
    return axios.post('/delete/files', params)
}
