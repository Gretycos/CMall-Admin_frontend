<template>
    <el-card class="order-container">
        <div class="data">
            <el-card class="data-item" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>订单状态</span>
                    </div>
                </template>
                <div>
                    {{ state.data.orderStatusString }}
                </div>
            </el-card>
            <el-card class="data-item" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>创建时间</span>
                    </div>
                </template>
                <div>
                    {{ state.data.createTime }}
                </div>
            </el-card>
            <el-card class="data-item" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>订单号</span>
                    </div>
                </template>
                <div>
                    {{ state.data.orderNo }}
                </div>
            </el-card>
        </div>
        <div class="data">
            <el-card class="data-item" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>支付状态</span>
                    </div>
                </template>
                <div>
                    {{ state.data.payStatus === 1? '支付成功' : '未支付' }}
                </div>
            </el-card>
            <el-card class="data-item" shadow="hover" v-if="state.data.payStatus === 1">
                <template #header>
                    <div class="card-header">
                        <span>支付方式</span>
                    </div>
                </template>
                <div>
                    {{ state.data.payTypeString }}
                </div>
            </el-card>
            <el-card class="data-item" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <span>地址</span>
                    </div>
                </template>
                <div>
                    {{ state.data.userAddress }}
                </div>
            </el-card>
        </div>
        <el-table
                :data="state.tableData"
                tooltip-effect="dark"
                style="width: 100%"
        >
            <el-table-column
                    label="商品图片"
            >
                <template #default="scope">
                    <img style="width: 100px" :key="scope.row.goodsId" :src="scope.row.goodsCoverImg" alt="商品主图">
                </template>
            </el-table-column>
            <el-table-column
                    prop="goodsId"
                    label="商品编号"
            >
            </el-table-column>
            <el-table-column
                    prop="goodsName"
                    label="商品名"
            ></el-table-column>
            <el-table-column
                    prop="goodsCount"
                    label="商品数量"
            >
            </el-table-column>
            <el-table-column
                    prop="sellingPrice"
                    label="价格"
            >
            </el-table-column>
            <el-table-column
                prop="paidPrice"
                label="实际付款"
                v-if="state.data.payStatus === 1"
            >
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import {getOrderDetail} from "@/service/order.js";

const route = useRoute()
const { id } = route.query
const state = reactive({
    data: {},
    tableData: []
})

onMounted(async () => {
    const {data} = await getOrderDetail(id)
    state.data = data
    state.tableData = data.orderItemVOList
})

</script>

<style scoped>
.data {
    display: flex;
    margin-bottom: 50px;
}
.data .data-item {
    flex: 1;
    margin: 0 10px;
}
.el-table {
    border: 1px solid #EBEEF5;
    border-bottom: none;
}
.has-gutter th {
    border-right: 1px solid #EBEEF5;
}

.has-gutter th:last-child {
    border-right: none;
}
.el-table__row td {
    border-right: 1px solid #EBEEF5;
}
.el-table__row td:last-child {
    border-right: none;
}
</style>
