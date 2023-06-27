<template>
    <el-card class="coupon-container">
        <template #header>
            <div class="header">
                <el-button type="primary" :icon="Plus" @click="handleAdd">新增优惠券</el-button>
                <el-button type="primary" :icon="Edit" @click="handleEdit(state.id)" v-if="state.id">修改优惠券</el-button>
            </div>
        </template>
        <el-table
            v-loading="state.loading"
            :data="state.tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
            :stripe="true"
            :border="true"
            @current-change="handleCurrentChange"
        >
            <el-table-column type="expand">
                <template #default="props">
                    <div v-if="props.row.couponCode">兑换码: {{props.row.couponCode}}</div>
                    <div>商品限制类型: {{props.row.goodsType === 0 ? '全品类' : props.row.goodsType === 1 ? '类目限制' : '商品限制'}}</div>
                    <div v-if="props.row.goodsValue">商品限制值: {{props.row.goodsValueNames}}</div>
                    <div>创建时间: {{props.row.createTime}}</div>
                    <div v-if="props.row.editTime">修改时间: {{props.row.editTime}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="couponId"
                label="优惠券编号"
                width="100%"
                header-align="center"
                align="right"
            >
            </el-table-column>
            <el-table-column
                prop="couponName"
                label="优惠券名称"
                header-align="center"
                width="100%"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="couponDesc"
                label="优惠券描述"
                width="100%"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="couponTotal"
                label="优惠券数量"
                width="100%"
                header-align="center"
                align="right"
            >
                <template #default="scope">
                    <span>{{scope.row.couponTotal === 0 ? '无限制' : scope.row.couponTotal}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="discount"
                label="抵扣金额"
                width="100%"
                header-align="center"
                align="right"
            >
            </el-table-column>
            <el-table-column
                prop="min"
                label="最低消费"
                width="100%"
                header-align="center"
                align="right"
            >
            </el-table-column>
            <el-table-column
                prop="couponLimit"
                label="领取限制"
                width="100%"
                align="center"
            >
                <template #default="scope">
                    <span>{{scope.row.couponLimit === 0 ? '无限制' : '限领取1张'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="couponStartTime"
                label="开始时间"
                width="100%"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="couponEndTime"
                label="结束时间"
                width="100%"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="couponType"
                label="类型"
                width="100%"
                align="center"
            >
                <template #default="scope">
                    <span>{{scope.row.couponType === 0 ? '通用券' : scope.row.couponType === 1 ? '注册赠送' : '兑换券'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="couponStatus"
                label="状态"
                width="100%"
                align="center"
            >
                <template #default="scope">
                    <span>{{scope.row.couponStatus === 0 ? '正常可用' : scope.row.couponStatus === 1 ? '过期' : '下架'}}</span>
                </template>
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
import {Edit, Plus} from "@element-plus/icons-vue";
import {getCurrentInstance, onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import {getCouponList} from "@/service/coupon.js";
import {convertTimeStamp} from "@/common/js/utils.js";

const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
const state = reactive({
    id: null,
    currentRow: null,
    loading: false,
    tableData: [], // 数据列表
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 10 // 分页大小
})

onMounted(() => {
    getCoupons()
})

const getCoupons = async () => {
    state.loading = true
    const params = {
        pageNumber: state.currentPage,
        pageSize: state.pageSize
    }
    const {data} = await getCouponList(params)
    state.tableData = data.list
    state.total = data.totalCount
    state.currentPage = data.currPage
    state.loading = false
    goTop && goTop()
}

const changePage = (val) => {
    state.currentPage = val
    getCoupons()
}

const handleCurrentChange = (currentRow) => {
    state.id = currentRow.couponId
}

const handleAdd = () => {
    router.push({ path: '/addCoupon' })
}

const handleEdit = (id) => {
    router.push({ path: '/addCoupon', query: { id } })
}


</script>

<style scoped>
.coupon-container {
    min-height: 100%;
}
.el-card.is-always-shadow {
    min-height: 100%!important;
}
</style>
