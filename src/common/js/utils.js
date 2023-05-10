/**
 * author: Tsong
 * time: 2023/5/4 15:27
 */
export const getLocal = (name) => {
    return localStorage.getItem(name)
}

export const setLocal = (name, value) => {
    localStorage.setItem(name, value)
}

export const removeLocal = (name) => {
    localStorage.removeItem(name)
}

export const uploadImgServer = '/api/upload/file'

export const uploadImgsServer = '/api/upload/files'

export const pathMap = {
    login: '登录',
    introduce: '系统介绍',
    dashboard: '大盘数据',
    add: '添加商品',
    carousel: '轮播图配置',
    hot: '热销商品配置',
    new: '新品上线配置',
    recommend: '为你推荐配置',
    seckill:'秒杀配置',
    category: '分类管理',
    level2: '分类二级管理',
    level3: '分类三级管理',
    goods: '商品管理',
    guest: '会员管理',
    order: '订单管理',
    order_detail: '订单详情',
    account: '修改账户'
}

export const convertTimeStamp = (timestamp, fmt) => {
    const date = new Date(timestamp)
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substring(str.length));
        }
    }
    return fmt
}
