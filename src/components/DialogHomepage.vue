<template>
    <el-dialog
            :title="type === 'add' ? '添加商品' : '修改商品'"
            v-model="state.visible"
            width="400px"
    >
        <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="商品编号" prop="id">
                <el-input type="number" v-model="state.ruleForm.id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input type="text" v-model="state.ruleForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="link">
                <el-input type="text" v-model="state.ruleForm.link"></el-input>
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {addHomepage, editHomepage, getHomepageDetail} from "@/service/homepage.js";
import {getGoodsName} from "@/service/goods.js";

const props = defineProps({
    type: String,
    configType: Number,
    reload: Function
})
const formRef = ref(null)

const checkId = async (rule, val, callback) => {
    if (state.id){
        callback()
    }else{
        try{
            const {data} = await getGoodsName(val)
            state.ruleForm.name = data.goodsName
            callback()
        }catch (e){
            state.ruleForm.name = ''
            callback(new Error('商品编码不存在'))
        }
    }

}

const state = reactive({
    visible: false,
    ruleForm: {
        id: '',
        name: '',
        link: '',
        sort: ''
    },
    rules: {
        id: [
            { required: 'true', message: '商品编号不能为空', trigger: ['change'] },
            { validator: checkId, trigger: ['blur']}
        ],
        sort: [
            { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ]
    },
    id: ''
})
// 获取详情
const getDetail = async (id) => {
    const {data} = await getHomepageDetail(id)
    state.ruleForm = {
        name: data.configName,
        id: data.goodsId,
        link: data.redirectUrl,
        sort: data.configRank
    }
}

// 开启弹窗
const open = (id) => {
    state.visible = true
    if (id) {
        state.id = id
        getDetail(id)
    } else {
        state.ruleForm = {
            name: '',
            id: '',
            link: '',
            sort: ''
        }
    }
}

// 关闭弹窗
const close = () => {
    state.visible = false
}

// 提交表单
const submitForm = () => {
    formRef.value.validate( async (valid) => {
        if (valid) {
            let params = {
                configType: props.configType || 3,
                configName: state.ruleForm.name,
                redirectUrl: state.ruleForm.link,
                goodsId: state.ruleForm.id,
                configRank: state.ruleForm.sort
            }
            if (props.type === 'add') {
                await addHomepage(params)
                ElMessage.success('添加成功')
            } else {
                params.configId = state.id
                await editHomepage(params)
                ElMessage.success('修改成功')
            }
            state.visible = false
            if (props.reload) props.reload()
        }
    })
}

defineExpose({ open, close })

</script>

<style scoped>

</style>
