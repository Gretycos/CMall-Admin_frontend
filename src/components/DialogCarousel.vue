<template>
    <el-dialog
            :title="type === 'add' ? '添加轮播图' : '修改轮播图'"
            v-model="state.visible"
            width="400px"
            @close="close"
    >
        <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="商品" prop="goods">
                <el-select
                    v-model="state.goodsId"
                    placeholder="请选择商品"
                    style="width: 300px"
                    filterable
                    remote
                    :disabled="!!state.id"
                    :remote-method="remoteSearch"
                    :reserve-keyword="false"
                    :loading="state.loadingOptions"
                    @change="changeSelect"
                >
                    <el-option
                        v-for="item in state.options"
                        :key="item.id"
                        :label="item.name+', ['+item.id + ']'"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="url">
                <img style="height: 120px;" :src="state.ruleForm.url" />
            </el-form-item>
            <el-form-item label="跳转链接" prop="link">
                <el-input type="text" v-model="state.ruleForm.link" disabled></el-input>
            </el-form-item>
            <el-form-item label="排序值" prop="sort">
                <el-input type="number" v-model="state.ruleForm.sort"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue'
import { ElMessage } from 'element-plus'
import {addCarousel, editCarousel, getCarouselDetail} from "@/service/carousel.js";
import {getGoodsCarousel, searchAllGoodsIdsAndNames} from "@/service/goods.js";

const props = defineProps({
    type: String,
    reload: Function
})
const formRef = ref(null)
const state = reactive({
    id: '',
    goodsId: '',
    options: [],
    loadingOptions: false,
    visible: false,
    ruleForm: {
        url: '',
        link: '',
        sort: ''
    },
    rules: {
        url: [
            { required: 'true', message: '图片不能为空', trigger: ['change'] }
        ],
        link: [
            { required: 'true', message: '跳转链接不能为空', trigger: ['change'] }
        ],
        sort: [
            { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ]
    },
})
// 获取详情
const getDetail = async (id) => {
    const {data} = await getCarouselDetail(id)
    state.ruleForm = {
        url: data.carouselUrl,
        link: data.redirectUrl,
        sort: data.carouselRank
    }
    state.goodsId = data.redirectUrl.substring(data.redirectUrl.lastIndexOf('/') + 1)
}

// 开启弹窗
const open = async (id) => {
    state.visible = true
    const {data} = await searchAllGoodsIdsAndNames()
    state.options = data.map(e => {
        return {
            id: e.goodsId+'',
            name: e.goodsName
        }
    })
    if (id) {
        state.id = id
        await getDetail(id)
    } else {
        state.ruleForm = {
            url: '',
            link: '',
            sort: ''
        }
    }
}

// 关闭弹窗
const close = async () => {
    state.visible = false
    state.id = ''
    state.goodsId = ''
}

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let params = {
                carouselUrl: state.ruleForm.url,
                redirectUrl: state.ruleForm.link,
                carouselRank: state.ruleForm.sort
            }
            if (props.type === 'add') {
                await addCarousel(params)
                ElMessage.success('添加成功')
            } else {
                params.carouselId = state.id
                await editCarousel(params)
                ElMessage.success('修改成功')
            }
            state.visible = false
            if (props.reload) props.reload()
        }
    })
}

const remoteSearch = async (query) => {
    state.loadingOptions = true
    if (query){
        state.options = state.options.filter(e => {
            return e.name.includes(query)
        })
    } else {
        const {data} = await searchAllGoodsIdsAndNames()
        state.options = data.map(e => {
            return {
                id: e.goodsId+'',
                name: e.goodsName
            }
        })
    }
    state.loadingOptions = false
}

const changeSelect = async (val) => {
    console.log(val)
    const {data} = await getGoodsCarousel(val)
    state.ruleForm.url = data.goodsCarousel.split(',')[0]
    state.ruleForm.link = '/product/' + data.goodsId
}

defineExpose({ open, close })
</script>

<style scoped>
.avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
}
.avatar-uploader >>> .el-upload {
    width: 100%;
    text-align: center;
}
.avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
}
</style>
