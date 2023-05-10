<template>
    <el-card class="seckill-container">
        <div class="header">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新建秒杀</el-button>
        </div>
        <el-table
            v-loading="state.loading"
            :data="state.tableData"
            tooltip-effect="dark"
            style="width: 100%"
        >
            <el-table-column
                prop="seckillId"
                label="秒杀编号"
            >
            </el-table-column>
            <el-table-column
                prop="goodsId"
                label="商品编号"
            >
            </el-table-column>
            <el-table-column
                prop="goodsName"
                label="商品名称"
            >
            </el-table-column>
            <el-table-column
                label="商品图片"
                width="150px"
            >
                <template #default="scope">
                    <img style="width: 100px; height: 100px;" :key="scope.row.seckillId" :src="$filters.prefix(scope.row.goodsCoverImg)" alt="商品主图">
                </template>
            </el-table-column>
            <el-table-column
                prop="seckillPrice"
                label="秒杀价格"
            >
            </el-table-column>
            <el-table-column
                prop="seckillNum"
                label="秒杀数量"
            >
            </el-table-column>
            <el-table-column
                label="秒杀状态"
            >
                <template #default="scope">
                    <span style="color: green;" v-if="scope.row.seckillStatus">秒杀中</span>
                    <span style="color: red;" v-else>已下架</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="seckillBegin"
                label="秒杀开始时间"
            >
            </el-table-column>
            <el-table-column
                prop="seckillEnd"
                label="秒杀结束时间"
            >
            </el-table-column>
            <el-table-column
                prop="seckillRank"
                label="排序值"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                width="100"
            >
                <template #default="scope">
                    <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.seckillId)">修改</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="秒杀创建时间"
            >
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="秒杀更新时间"
            >
            </el-table-column>
        </el-table>
        <!--总数超过一页，再展示分页器-->
        <el-pagination
            background
            layout="prev, pager, next"
            :total="state.total"
            :page-size="state.pageSize"
            :current-page="state.currentPage"
            @current-change="changePage"
        />
    </el-card>
</template>

<script setup>
import {Plus} from "@element-plus/icons-vue";
import {onMounted, getCurrentInstance, reactive} from "vue";
import {useRouter} from "vue-router";
import {getSeckillList} from "@/service/seckill.js";

const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10 // 分页大小
})

onMounted(() => {
    getSeckill()
})

const getSeckill = async () => {
    state.loading = true
    const params = {
        pageNumber: state.currentPage,
        pageSize: state.pageSize
    }
    const {data} = getSeckillList(params)
    state.tableData = data.list
    state.total = data.totalCount
    state.currentPage = data.currPage
    state.loading = false
    goTop && goTop()
}

const handleAdd = () => {
    router.push({ path: '/addSeckill' })
}

const handleEdit = (id) => {
    router.push({ path: '/addSeckill', query: { id } })
}

const changePage = (val) => {
    state.currentPage = val
    getSeckill()
}

</script>

<style scoped>
.goods-container {
    min-height: 100%;
}
.el-card.is-always-shadow {
    min-height: 100%!important;
}
</style>