<template>
    <div class="add">
        <el-card class="add-container">
            <el-form :model="state.seckillForm" :rules="state.rules" ref="seckillRef" label-width="100px" class="seckillForm">
                <el-form-item label="商品编码" prop="goodsId">
                    <el-input style="width: 300px" v-model="state.seckillForm.goodsId" :disabled="!!id" @blur="handleGoodsIdBlur"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input style="width: 300px" v-model="state.seckillForm.goodsName" disabled></el-input>
                </el-form-item>
                <el-form-item  label="商品主图" prop="goodsCoverImg" v-if="state.seckillForm.goodsCoverImg !== ''">
                    <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" :src="state.seckillForm.goodsCoverImg" class="avatar">
                </el-form-item>
                <el-form-item label="商品秒杀价" prop="seckillPrice">
                    <el-input-number :min="0" :precision="2" style="width: 300px" v-model="state.seckillForm.seckillPrice" placeholder="请输入商品售价"></el-input-number>
                </el-form-item>
                <el-form-item label="秒杀库存" prop="seckillNum">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.seckillForm.seckillNum" placeholder="请输入商品库存"></el-input>
                </el-form-item>
                <el-form-item label="排序值" prop="seckillRank">
                    <el-input type="number" style="width: 300px" v-model="state.seckillForm.seckillRank"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" prop="seckillStatus">
                    <el-radio-group v-model="state.seckillForm.seckillStatus">
                        <el-radio :label="true">上架</el-radio>
                        <el-radio :label="false">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="开始时间" required>
                    <el-form-item prop="seckillBeginDate">
                        <el-date-picker
                            v-model="state.seckillForm.seckillBeginDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="Pick a day"
                            :disabled-date="disabledStartDate"
                        />
                    </el-form-item>
                    <el-form-item prop="seckillBeginTime">
                        <el-time-select
                            v-model="state.seckillForm.seckillBeginTime"
                            :min-time="getBeginMinTime()"
                            :max-time="state.seckillForm.seckillEndTime"
                            start="09:00"
                            step="00:15"
                            end="23:00"
                            format="HH:mm:ss"
                            placeholder="Select time"
                        />
                    </el-form-item>
                </el-form-item>
                <el-form-item label="结束时间" required>
                    <el-form-item prop="seckillEndDate">
                        <el-date-picker
                            v-model="state.seckillForm.seckillEndDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="Pick a day"
                            :disabled-date="disabledEndDate"
                        />
                    </el-form-item>
                    <el-form-item prop="seckillEndTime">
                        <el-time-select
                            v-model="state.seckillForm.seckillEndTime"
                            :min-time="state.seckillForm.seckillBeginTime"
                            start="09:15"
                            step="00:15"
                            end="23:15"
                            format="HH:mm:ss"
                            placeholder="Select time"
                        />
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAdd()">{{ state.id ? '立即修改' : '立即创建' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {addSeckill, editSeckill, getSeckillDetail} from "@/service/seckill.js";
import {ElMessage} from "element-plus";
import {getGoodsDetail} from "@/service/goods.js";

const { proxy } = getCurrentInstance()
const seckillRef = ref(null)
const route = useRoute()
const router = useRouter()
const { id } = route.query
const state = reactive({
    id: id,
    seckillForm: {
        goodsId: '',
        goodsName: '',
        goodsCoverImg: '',
        seckillPrice: 0,
        seckillNum: 0,
        seckillRank: 0,
        seckillStatus: false,
        seckillBeginDate: '',
        seckillBeginTime: '',
        seckillEndDate: '',
        seckillEndTime: ''
    },
    rules: {
        goodsId: [
            { required: 'true', message: '请填写商品id', trigger: ['change'] }
        ],
        seckillPrice: [
            { required: 'true', message: '请填写秒杀价格', trigger: ['change'] }
        ],
        seckillNum: [
            { required: 'true', message: '请填写秒杀库存', trigger: ['change'] }
        ],
        seckillRank: [
            { required: 'true', message: '请填写秒杀排序值', trigger: ['change'] }
        ],
        seckillStatus: [
            { required: 'true', message: '请选择上架状态', trigger: ['change'] }
        ],
        seckillBeginDate: [
            { required: 'true', message: '请选择秒杀开始日期', trigger: ['change'] }
        ],
        seckillBeginTime: [
            { required: 'true', message: '请选择秒杀开始时间', trigger: ['change'] }
        ],
        seckillEndDate: [
            { required: 'true', message: '请选择秒杀结束日期', trigger: ['change'] }
        ],
        seckillEndTime: [
            { required: 'true', message: '请选择秒杀结束时间', trigger: ['change'] }
        ]
    },
})

onMounted(async () => {
    if (id) {
        const {data} = await getSeckillDetail(id)
        state.seckillForm = {
            goodsId: data.goodsId,
            goodsName: data.goodsName,
            goodsCoverImg: data.goodsCoverImg,
            seckillPrice: data.seckillPrice,
            seckillNum: data.seckillNum,
            seckillRank: data.seckillRank,
            seckillStatus: data.seckillStatus,
            seckillBeginDate: data.seckillBegin.split(' ')[0],
            seckillBeginTime:  data.seckillBegin.split(' ')[1],
            seckillEndDate:  data.seckillEnd.split(' ')[0],
            seckillEndTime: data.seckillEnd.split(' ')[1]
        }
    }
})

const submitAdd = () => {
    seckillRef.value.validate( async (valid) => {
        if (valid) {
            let params = {
                seckillPrice: state.seckillForm.seckillPrice,
                seckillNum: state.seckillForm.seckillNum,
                seckillRank: state.seckillForm.seckillRank,
                seckillStatus: state.seckillForm.seckillStatus,
                seckillBegin: state.seckillForm.seckillBeginDate + ' ' + state.seckillForm.seckillBeginTime,
                seckillEnd:  state.seckillForm.seckillEndDate + ' ' + state.seckillForm.seckillEndTime,
            }
            console.log(params)
            if (id) {
                params.seckillId = id
                await editSeckill(params)
                ElMessage.success('修改成功')
            } else {
                params.goodsId = state.seckillForm.goodsId
                await addSeckill(params)
                ElMessage.success('添加成功')
            }
            await router.push({path: '/seckill'})
        }
    })
}

const handleGoodsIdBlur = async () => {
    if (state.seckillForm.goodsId){
        const {data} = await getGoodsDetail(state.seckillForm.goodsId)
        state.seckillForm.goodsName = data.goodsInfo.goodsName
        state.seckillForm.goodsCoverImg = data.goodsInfo.goodsCoverImg
    }

}

// 禁用今天之前的日期
const disabledStartDate = (time) => {
    const today = new Date()
    today.setDate(today.getDate() - 1)
    return time.getTime() < today.getTime()
}

// 禁用今天之前以及7天之后的日期
const disabledEndDate = (time) => {
    const today = new Date()
    today.setDate(today.getDate() - 1)
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + 7)
    return time.getTime() < today.getTime() || time.getTime() > nextDate.getTime()
}

// 开始的最小时间
const getBeginMinTime = () => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}`
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
