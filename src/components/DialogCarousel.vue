<template>
    <el-dialog
            :title="type == 'add' ? '添加轮播图' : '修改轮播图'"
            v-model="state.visible"
            width="400px"
    >
        <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="图片" prop="url">
                <el-upload
                        class="avatar-uploader"
                        :action="state.uploadImgServer"
                        accept="jpg,jpeg,png"
                        :headers="{
            token: state.token
          }"
                        :show-file-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleUrlSuccess"
                >
                    <img style="width: 200px; height: 100px; border: 1px solid #e9e9e9;" v-if="state.ruleForm.url" :src="state.ruleForm.url" class="avatar">
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
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
import {getLocal, uploadImgServer} from "@/common/js/utils.js";
import {addCarousel, editCarousel, getCarouselDetail} from "@/service/carousel.js";

const props = defineProps({
    type: String,
    reload: Function
})

const formRef = ref(null)
const state = reactive({
    uploadImgServer,
    token: getLocal('token') || '',
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
        sort: [
            { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ]
    },
    id: ''
})
// 获取详情
const getDetail = async (id) => {
    const {data} = getCarouselDetail(id)
    state.ruleForm = {
        url: data.carouselUrl,
        link: data.redirectUrl,
        sort: data.carouselRank
    }
}

const handleBeforeUpload = (file) => {
    const suffix = file.name.split('.')[1] || ''
    if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
    }
}

// 上传图片
const handleUrlSuccess = (val) => {
    state.ruleForm.url = val.data || ''
}

// 开启弹窗
const open = (id) => {
    state.visible = true
    if (id) {
        state.id = id
        getDetail(id)
    } else {
        state.ruleForm = {
            url: '',
            link: '',
            sort: ''
        }
    }
}

// 关闭弹窗
const close = () => {
    state.visible = false
}

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            if (props.type === 'add') {
                const params = {
                    carouselUrl: state.ruleForm.url,
                    redirectUrl: state.ruleForm.link,
                    carouselRank: state.ruleForm.sort
                }
                await addCarousel(params)
                ElMessage.success('添加成功')
                state.visible = false
                if (props.reload) props.reload()
            } else {
                const params = {
                    carouselId: state.id,
                    carouselUrl: state.ruleForm.url,
                    redirectUrl: state.ruleForm.link,
                    carouselRank: state.ruleForm.sort
                }
                await editCarousel(params)
                ElMessage.success('修改成功')
                state.visible = false
                if (props.reload) props.reload()
            }
        }
    })
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