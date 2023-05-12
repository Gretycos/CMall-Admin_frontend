<template>
    <div class="add">
        <el-card class="add-container">
            <el-form :model="state.couponForm" :rules="state.rules" ref="couponRef" label-width="100px" class="couponForm">
                <el-form-item label="优惠券名称" prop="couponName">
                    <el-input style="width: 300px" v-model="state.couponForm.couponName" placeholder="请输入优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="优惠券描述" prop="couponDesc">
                    <el-input style="width: 300px" type="textarea" v-model="state.couponForm.couponDesc" placeholder="请输入优惠券描述(100字)"></el-input>
                </el-form-item>
                <el-form-item label="优惠券数量" prop="couponTotal">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.couponForm.couponTotal" placeholder="请输入优惠券数量"></el-input>
                </el-form-item>
                <el-form-item label="抵扣金额" prop="discount">
                    <el-input type="number" min="1" style="width: 300px" v-model="state.couponForm.discount" placeholder="请输入抵扣金额"></el-input>
                </el-form-item>
                <el-form-item label="最低消费" prop="min">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.couponForm.min" placeholder="请输入最低消费"></el-input>
                </el-form-item>
                <el-form-item label="领取限制" prop="couponLimit">
                    <el-radio-group v-model="state.couponForm.couponLimit">
                        <el-radio label="0">无限制</el-radio>
                        <el-radio label="1">限领1张</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="开始时间" prop="couponStartTime">
                    <el-date-picker
                        v-model="state.couponForm.couponStartTime"
                        type="datetime"
                        :disabled-date="getDisabledStartTime"
                        placeholder="请选择开始时间"
                    />
                </el-form-item>
                <el-form-item label="结束时间" prop="couponEndTime">
                    <el-date-picker
                        v-model="state.couponForm.couponEndTime"
                        type="datetime"
                        :disabled-date="getDisabledEndTime"
                        placeholder="请选择结束时间"
                    />
                </el-form-item>
                <el-form-item label="类型" prop="couponType">
                    <el-radio-group v-model="state.couponForm.couponType">
                        <el-radio label="0">通用券</el-radio>
                        <el-radio label="1">注册赠送</el-radio>
                        <el-radio label="2">兑换券</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态" prop="couponStatus">
                    <el-radio-group v-model="state.couponForm.couponStatus">
                        <el-radio label="0">正常可用</el-radio>
                        <el-radio label="1">过期</el-radio>
                        <el-radio label="2">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品限制类型" prop="goodsType">
                    <el-radio-group v-model="state.couponForm.goodsType">
                        <el-radio label="0">全品类</el-radio>
                        <el-radio label="1">类目限制</el-radio>
                        <el-radio label="2">商品限制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品限制值" prop="goodsValue" v-if="state.couponForm.goodsType !== 0">
                    <el-input style="width: 300px" v-model="state.couponForm.goodsValue" placeholder="请输入商品限制值（用,隔开）"></el-input>
                </el-form-item>
                <el-form-item label="兑换码" prop="couponCode" v-if="state.couponForm.couponType === 2 && state.id">
                    <el-input style="width: 300px" v-model="state.couponForm.couponCode" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAdd()">{{ state.id ? '立即修改' : '立即添加' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getCategoryDetail} from "@/service/category.js";
import {getGoodsDetail} from "@/service/goods.js";
import {addCoupon, editCoupon, getCouponDetail} from "@/service/coupon.js";
import {ElMessage} from "element-plus";

const couponRef = ref(null)
const route = useRoute()
const router = useRouter()
const { id } = route.query

const checkGoodsValue = async (rule, value, callback) => {
    if (state.couponForm.goodsType === 0){
        rule.required = 'false'
        callback()
    } else {
        rule.required = 'true'
        const newValue = value.replace(' ', '')
        const ids = newValue.split(',')
        if (ids.length === 0){
            callback(new Error('请填写至少一个分类'))
        } else {
            for (const val of ids) {
                try {
                    if (state.couponForm.goodsType === 1){
                        await getCategoryDetail(val)
                    } else {
                        await getGoodsDetail(val)
                    }
                } catch (e) {
                    callback(new Error('请检查输入的商品限制值'))
                }
            }
            callback()
        }
    }
}

const state = reactive({
    id: id,
    couponForm: {
        couponName: '',
        couponDesc: '',
        couponTotal: 0,
        discount: 1,
        min: 1,
        couponLimit: 1,
        couponStartTime: '',
        couponEndTime: '',
        couponType: 0,
        couponStatus: 0,
        goodsType: 0,
        goodsValue: '',
        couponCode: ''
    },
    rules: {
        couponName: [
            { required: 'true', message: '请填写优惠券名称', trigger: ['change'] },
        ],
        couponDesc: [
            { required: 'true', max: 100, message: '请填写优惠券描述', trigger: ['change'] },
        ],
        couponTotal: [
            { required: 'true', message: '请填写优惠券数量', trigger: ['change'] },
        ],
        discount: [
            { required: 'true', message: '请填写抵扣金额', trigger: ['change'] },
        ],
        min: [
            { required: 'true', message: '请填写最低消费', trigger: ['change'] },
        ],
        couponLimit: [
            { required: 'true', message: '请选择领取限制', trigger: ['change'] },
        ],
        couponStartTime: [
            { required: 'true', message: '请选择开始时间', trigger: ['change'] },
        ],
        couponEndTime: [
            { required: 'true', message: '请选择开始时间', trigger: ['change'] },
        ],
        couponType: [
            { required: 'true', message: '请选择类型', trigger: ['change'] },
        ],
        couponStatus: [
            { required: 'true', message: '请选择状态', trigger: ['change'] },
        ],
        goodsType: [
            { required: 'true', message: '请选择商品限制类型', trigger: ['change'] },
        ],
        goodsValue: [
            { validator: checkGoodsValue, message: '请填写商品限制值', trigger: ['change'] },
        ],
    }
})

onMounted(async () => {
    if (id) {
        const {data} = await getCouponDetail(id)
        state.couponForm = {
            couponName: data.couponName,
            couponDesc: data.couponDesc,
            couponTotal: data.couponTotal,
            discount: data.discount,
            min: data.min,
            couponLimit: data.couponLimit,
            couponStartTime: data.couponStartTime,
            couponEndTime: data.couponEndTime,
            couponType: data.couponType,
            couponStatus: data.couponStatus,
            goodsType: data.goodsType,
            goodsValue: data.goodsValue,
            couponCode: data.couponCode
        }
    }
})

const submitAdd = () => {
    couponRef.value.validate( async (valid) => {
        if (valid) {
            let params = {
                couponName: state.couponForm.couponName,
                couponDesc: state.couponForm.couponDesc,
                couponTotal: state.couponForm.couponTotal,
                discount: state.couponForm.discount,
                min: state.couponForm.min,
                couponLimit: state.couponForm.couponLimit,
                couponStartTime: state.couponForm.couponStartTime,
                couponEndTime: state.couponForm.couponEndTime,
                couponType: state.couponForm.couponType,
                couponStatus: state.couponForm.couponStatus,
                goodsType: state.couponForm.goodsType,
                goodsValue: state.couponForm.goodsValue,
                couponCode: state.couponForm.couponCode
            }
            if (id) {
                params.couponId = id
                await editCoupon(params)
                ElMessage.success('修改成功')
            } else {
                await addCoupon(params)
                ElMessage.success('添加成功')
            }
            await router.push({path: '/coupon'})
        }
    })
}

const getDisabledStartTime = (date) => {
    return date.getTime() < new Date().getTime()
}

const getDisabledEndTime = (date) => {
    return date.getTime() <= new Date(state.couponForm.couponStartTime).getTime()
}
</script>

<style scoped>
.add {
    display: flex;
}
.add-container {
    flex: 1;
    height: 100%;
}
.toolbar{
    border-bottom: 1px solid #ccc
}
</style>
