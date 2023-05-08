<template>
    <div class="add">
        <el-card class="add-container">
            <el-form :model="state.goodsForm" :rules="state.rules" ref="goodsRef" label-width="100px" class="goodsForm">
                <el-form-item required label="商品分类">
                    <el-cascader :placeholder="state.defaultCate" style="width: 300px" :props="state.category" @change="handleChangeCate"></el-cascader>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input style="width: 300px" v-model="state.goodsForm.goodsName" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品简介" prop="goodsIntro">
                    <el-input style="width: 300px" type="textarea" v-model="state.goodsForm.goodsIntro" placeholder="请输入商品简介(100字)"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="originalPrice">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.goodsForm.originalPrice" placeholder="请输入商品价格"></el-input>
                </el-form-item>
                <el-form-item label="商品售卖价" prop="sellingPrice">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.goodsForm.sellingPrice" placeholder="请输入商品售价"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="stockNum">
                    <el-input type="number" min="0" style="width: 300px" v-model="state.goodsForm.stockNum" placeholder="请输入商品库存"></el-input>
                </el-form-item>
                <el-form-item label="商品标签" prop="tag">
                    <el-input style="width: 300px" v-model="state.goodsForm.tag" placeholder="请输入商品小标签"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" prop="goodsSaleStatus">
                    <el-radio-group v-model="state.goodsForm.goodsSaleStatus">
                        <el-radio label="0">上架</el-radio>
                        <el-radio label="1">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item required label="商品主图" prop="goodsCoverImg">
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
                        <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="state.goodsForm.goodsCoverImg" :src="state.goodsForm.goodsCoverImg" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="详情内容">
                    <div ref='editor'></div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAdd()">{{ state.id ? '立即修改' : '立即创建' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import {getLocal, uploadImgServer, uploadImgsServer} from "@/common/js/utils.js";
import {getCategoryList} from "@/service/category.js";
import WangEditor from "wangeditor";
import {addGoods, editGoods, getGoodsDetail} from "@/service/goods.js";

const { proxy } = getCurrentInstance()
let instance
const editor = ref(null)
const goodsRef = ref(null)
const route = useRoute()
const router = useRouter()
const { id } = route.query
const state = reactive({
    uploadImgServer,
    token: getLocal('token') || '',
    id: id,
    defaultCate: '',
    goodsForm: {
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        goodsSaleStatus: '0',
        goodsCoverImg: '',
        tag: ''
    },
    rules: {
        goodsName: [
            { required: 'true', message: '请填写商品名称', trigger: ['change'] }
        ],
        originalPrice: [
            { required: 'true', message: '请填写商品价格', trigger: ['change'] }
        ],
        sellingPrice: [
            { required: 'true', message: '请填写商品售价', trigger: ['change'] }
        ],
        stockNum: [
            { required: 'true', message: '请填写商品库存', trigger: ['change'] }
        ],
    },
    categoryId: '',
    category: {
        lazy: true,
        async lazyLoad (node, resolve) {
            const { level = 0, value } = node
            const params = {
                pageNumber: 1,
                pageSize: 1000,
                categoryLevel: level + 1,
                parentId: value || 0
            }
            const {data} = await getCategoryList(params)
            const list = data.list
            const nodes = list.map(item => ({
                value: item.categoryId,
                label: item.categoryName,
                leaf: level > 1
            }))
            resolve(nodes)
        }
    }
})

onMounted(async () => {
    instance = new WangEditor(editor.value)
    instance.config.showLinkImg = false
    instance.config.showLinkImgAlt = false
    instance.config.showLinkImgHref = false
    instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
    instance.config.uploadImgMaxLength = 5
    instance.config.uploadFileName = 'file'
    instance.config.uploadImgHeaders = {
        token: state.token
    }
    // 图片返回格式不同，需要自定义返回格式
    instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: (insertImgFn, result) => {
            console.log('result', result)
            // result 即服务端返回的接口
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            if (result.data && result.data.length) {
                result.data.forEach(item => insertImgFn(item))
            }
        }
    }
    instance.config.uploadImgServer = uploadImgsServer
    Object.assign(instance.config, {
        onchange() {
            console.log('change')
        },
    })
    instance.create()
    if (id) {
        const {data} = await getGoodsDetail(id)
        // console.log(data)
        const { goodsInfo, firstCategory, secondCategory, thirdCategory } = data
        state.goodsForm = {
            goodsName: goodsInfo.goodsName,
            goodsIntro: goodsInfo.goodsIntro,
            originalPrice: goodsInfo.originalPrice,
            sellingPrice: goodsInfo.sellingPrice,
            stockNum: goodsInfo.stockNum,
            goodsSaleStatus: String(goodsInfo.goodsSaleStatus),
            goodsCoverImg: proxy.$filters.prefix(goodsInfo.goodsCoverImg),
            tag: goodsInfo.tag
        }
        state.categoryId = goodsInfo.goodsCategoryId
        state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
        if (instance) {
            // 初始化商品详情 html
            instance.txt.html(goodsInfo.goodsDetailContent)
        }
    }
})

onBeforeUnmount(() => {
    instance.destroy()
    instance = null
})

const submitAdd = () => {
    goodsRef.value.validate(async (valid) => {
        if (valid){
            let params = {
                goodsCategoryId: state.categoryId,
                goodsCoverImg: state.goodsForm.goodsCoverImg,
                goodsDetailContent: instance.txt.html(),
                goodsIntro: state.goodsForm.goodsIntro,
                goodsName: state.goodsForm.goodsName,
                goodsSaleStatus: state.goodsForm.goodsSaleStatus,
                originalPrice: state.goodsForm.originalPrice,
                sellingPrice: state.goodsForm.sellingPrice,
                stockNum: state.goodsForm.stockNum,
                tag: state.goodsForm.tag
            }
            if (id){
                params.goodsId = id
                await editGoods(params)
                ElMessage.success('修改成功')
            } else {
                await addGoods(params)
                ElMessage.success('添加成功')
            }
            await router.push({path: '/goods'})
        }
    })
}

const handleBeforeUpload = (file) => {
    const suffix = file.name.split('.')[1] || ''
    if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
    }
}

const handleUrlSuccess = (val) => {
    state.goodsForm.goodsCoverImg = val.data || ''
}

const handleChangeCate = (val) => {
    state.categoryId = val[2] || 0
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
.avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
}
.avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
}
</style>
