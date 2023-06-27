<template>
    <el-table
            v-loading="state.loading"
            :data="state.tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
    >
        <slot name='column'></slot>
    </el-table>
    <el-pagination
            background
            layout="prev, pager, next"
            :total="state.total"
            :page-size="state.pageSize"
            :current-page="state.currentPage"
            @current-change="changePage"
    />
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import {getMallUser} from "@/service/mallUser.js";

const props = defineProps({
    action: String
})

const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10, // 分页大小
    multipleSelection: []
})
onMounted(() => {
    getList()
})

const getList = async () => {
    state.loading = true
    if (props.action.includes('users')){
        const params = {
            pageNumber: state.currentPage,
            pageSize: state.pageSize
        }
        setTimeout(async () => {
            const {data} = await getMallUser(params)
            state.tableData = data.list
            state.total = data.totalCount
            state.currentPage = data.currPage
            state.loading = false
            goTop && goTop() // 回到顶部
        }, 1500)
    }
}

const handleSelectionChange = (val) => {
    state.multipleSelection = val
}

const changePage = (val) => {
    state.currentPage = val
    getList()
}

defineExpose({ state: state, getList: getList })

</script>


<style scoped>

</style>
