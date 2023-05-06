<template>
    <el-card class="account-container">
        <el-form :model="state.nameForm" :rules="state.rules" ref="nameRef" label-width="80px" label-position="right" class="demo-ruleForm">
            <el-form-item label="登录名：" prop="loginName">
                <el-input style="width: 200px" v-model="state.nameForm.loginName"></el-input>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickName">
                <el-input style="width: 200px" v-model="state.nameForm.nickName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitName">确认修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card class="account-container">
        <el-form :model="state.passForm" :rules="state.rules" ref="passRef" label-width="80px" label-position="right" class="demo-ruleForm">
            <el-form-item label="原密码：" prop="oldPass">
                <el-input style="width: 200px" v-model="state.passForm.oldPass"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPass">
                <el-input style="width: 200px" v-model="state.passForm.newPass"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="submitPass">确认修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import {editName, editPassword, getProfile} from "@/service/adminUser.js";

const nameRef = ref(null)
const passRef = ref(null)
const state = reactive({
    user: null,
    nameForm: {
        loginName: '',
        nickName: ''
    },
    passForm: {
        oldPass: '',
        newPass: ''
    },
    rules: {
        loginName: [
            { required: 'true', message: '登录名不能为空', trigger: ['change'] }
        ],
        nickName: [
            { required: 'true', message: '昵称不能为空', trigger: ['change'] }
        ],
        oldPass: [
            { required: 'true', message: '原密码不能为空', trigger: ['change'] }
        ],
        newPass: [
            { required: 'true', message: '新密码不能为空', trigger: ['change'] }
        ]
    },
})

onMounted(async () => {
    const {data} = await getProfile()
    state.user = data
    state.nameForm.loginName = data.loginUserName
    state.nameForm.nickName = data.nickName
})

const submitName = () => {
    nameRef.value.validate(async (valid) => {
        if (valid){
            const params = {
                loginUserName: state.nameForm.loginName,
                nickName: state.nameForm.nickName
            }
            await editName(params)
            ElMessage.success('修改成功')
            window.location.reload()
        }
    })
}

const submitPass = () => {
    passRef.value.validate(async (valid) => {
        if (valid){
            const params = {
                originalPassword: md5(state.passForm.oldPass),
                newPassword: md5(state.passForm.newPass)
            }
            await editPassword(params)
            ElMessage.success('修改成功')
            window.location.reload()
        }
    })
}
</script>

<style scoped>
.account-container {
    margin-bottom: 20px;
}
</style>
