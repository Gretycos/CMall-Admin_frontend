/**
 * author: Tsong
 * time: 2023/5/4 15:25
 */
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { setLocal, getLocal } from '@/common/js/utils'
import router from '@/router'


console.log('import.meta.env', import.meta.env)

axios.defaults.baseURL = import.meta.env.MODE === 'development' ? '/api' : ''
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = getLocal('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        ElMessage.error('服务端异常！')
        return Promise.reject(res)
    }
    // console.log('服务器返回数据: ')
    // console.log(res.data)
    if (res.data.resultCode !== 200) {
        if (res.data.message) ElMessage.error(res.data.message)
        if (res.data.resultCode === 419) {
            router.push({ path: '/login' })
        }
        if (res.data.data && window.location.hash === '#/login') {
            setLocal('token', res.data.data)
            axios.defaults.headers['token'] = res.data.data
        }
        return Promise.reject(res.data)
    }

    return res.data
})

export default axios
