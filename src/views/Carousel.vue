<template>
    <el-card class="swiper-container">
        <template #header>
            <div class="header">
                <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
                <el-popconfirm
                        title="确定删除吗？"
                        confirmButtonText='确定'
                        cancelButtonText='取消'
                        @confirm="handleDelete"
                >
                    <template #reference>
                        <el-button type="danger" :icon="Delete">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </template>
        <el-table
                v-loading="state.loading"
                ref="multipleTable"
                :data="state.tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="轮播图"
                    width="200">
                <template #default="scope">
                    <img style="width: 150px;height: 150px" :src="scope.row.carouselUrl" alt="轮播图">
                </template>
            </el-table-column>
            <el-table-column
                    label="跳转链接"
            >
                <template #default="scope">
                    <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
                </template>
            </el-table-column>
            <el-table-column
                    prop="carouselRank"
                    label="排序值"
                    width="120"
            >
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="添加时间"
                    width="200"
            >
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="state.total"
                :page-size="state.pageSize"
                :current-page="state.currentPage"
                @current-change="changePage"
        />
    </el-card>
    <DialogCarousel ref='dialogCarousel' :reload="getCarousels" :type="state.type" />
</template>

<script setup>
import DialogCarousel from "@/components/DialogCarousel.vue";
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import {deleteCarousel, getCarouselList} from "@/service/carousel.js";

const dialogCarousel = ref()
const state = reactive({
    loading: false,
    tableData: [], // 数据列表
    currentPage: 1,
    pageSize: 10,
    type: 'add', // 操作类型,
    multipleSelection: [], // 选中项
    total: 0, // 总条数
})

onMounted(() => {
    getCarousels()
})

// 获取轮播图列表
const getCarousels = async () => {
    state.loading = true
    const params = {
        pageNumber: state.currentPage,
        pageSize: state.pageSize
    }
    const {data} = await getCarouselList(params)
    state.tableData = data.list
    state.total = data.totalCount
    state.currentPage = data.currPage
    state.loading = false
}

// 添加轮播项
const handleAdd = () => {
    // console.log('addSwiper', addSwiper.value)
    state.type = 'add'
    dialogCarousel.value.open()
}

// 修改轮播图
const handleEdit = (id) => {
    state.type = 'edit'
    dialogCarousel.value.open(id)
}

// 选中之后的change方法，一旦选项有变化，就会触发该方法。
const handleSelectionChange = (val) => {
    state.multipleSelection = val
}

// 批量删除
const handleDelete = async () => {
    if (!state.multipleSelection.length) {
        ElMessage.error('请选择至少一项')
        return
    }
    const params = {
        ids: state.multipleSelection.map(i => i.carouselId)
    }
    await deleteCarousel(params)
    ElMessage.success('删除成功')
    await getCarousels()
}

const changePage = (val) => {
    state.currentPage = val
    getCarousels()
}

</script>

<style scoped>

</style>
