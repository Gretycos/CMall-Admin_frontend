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
                        <el-radio label="0">下架</el-radio>
                        <el-radio label="1">上架</el-radio>
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
                            :on-success="handleCoverUrlSuccess"
                    >
                        <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;object-fit: cover;" v-if="state.goodsForm.goodsCoverImg" :src="state.goodsForm.goodsCoverImg" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item required label="商品轮播图" prop="goodsCarousel">
                    <el-upload
                        class="avatar-uploader"
                        :action="state.uploadImgServer"
                        accept="jpg,jpeg,png"
                        :headers="{
                                token: state.token
                            }"
                        :show-file-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleCarouselUrlSuccess"
                    >

                        <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;object-fit: cover;" v-for="(item, index) in state.goodsForm.goodsCarousel" :src="item" class="avatar">
                        <el-icon class="avatar-uploader-icon" v-if="state.goodsForm.goodsCarousel.length < 5"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="详情内容">
                    <Toolbar
                        class="toolbar"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        :mode="mode"
                    />
                    <Editor
                        class="editor"
                        v-model="valueHtml"
                        :defaultConfig="editorConfig"
                        :mode="mode"
                        @onCreated="handleCreated"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitAdd()">{{ state.id ? '立即修改' : '立即创建' }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { reactive, ref, shallowRef, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import {getLocal, uploadImgServer, uploadImgsServer} from "@/common/js/utils.js";
import {getCategoryList} from "@/service/category.js";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {addGoods, editGoods, getGoodsDetail} from "@/service/goods.js";
import {deleteFiles} from "@/service/upload.js";

const { proxy } = getCurrentInstance()
const editorRef = shallowRef(null)
const valueHtml = ref('')
const mode = 'default'
const goodsRef = ref(null)
const route = useRoute()
const router = useRouter()
const { id } = route.query
// 图片相关
let coverOrigin = []
let coverHistory = []
let coverCurrent = []
let imagesOrigin = []
let imagesHistory = []
let imagesCurrent = []
let carouselOrigin = []
let carouselHistory = []
let carouselCurrent = []
// 响应式变量
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
        goodsCarousel: [],
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

const editorConfig =  {
    MENU_CONF: {
        'uploadImage': {
            server: uploadImgsServer,
            headers: {
                token: state.token
            },
            fieldName: 'file',
            maxNumberOfFiles: 5,
            maxFileSize: 2 * 1024 * 1024, // 2M
            customInsert(res, insertFn){
                if (res.data && res.data.length) {
                    console.log('插入图片', res.data)
                    res.data.forEach(item => {
                        imagesHistory.push(item)
                        insertFn(item)
                    })
                }
            }
        }
    }
}
const toolbarConfig = {}

onMounted(async () => {
    window.onbeforeunload = async () => {
        await beforeunloadHandler()
    }
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
            goodsCoverImg: goodsInfo.goodsCoverImg,
            goodsCarousel: goodsInfo.goodsCarousel.length > 0 ? goodsInfo.goodsCarousel.split(',') : [],
            tag: goodsInfo.tag
        }
        state.categoryId = goodsInfo.goodsCategoryId
        state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
        if (editorRef.value) {
            // 初始化商品详情 html
            editorRef.value.setHtml(goodsInfo.goodsDetailContent)
            imagesOrigin = editorRef.value.getElemsByType('image').map(item => item.src)
            imagesHistory = editorRef.value.getElemsByType('image').map(item => item.src)
        }
        coverOrigin = [goodsInfo.goodsCoverImg]
        coverHistory = [goodsInfo.goodsCoverImg]
        carouselOrigin = goodsInfo.goodsCarousel.length > 0 ? goodsInfo.goodsCarousel.split(',') : []
        carouselHistory = goodsInfo.goodsCarousel.length > 0 ? goodsInfo.goodsCarousel.split(',') : []
    }
})

onBeforeUnmount(async () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
    await deleteCoversUnsaved()
    await deleteImgsUnsaved()
    await deleteCarouselUnsaved()
})

const beforeunloadHandler = async () => {
    await deleteCoversUnsaved()
    await deleteImgsUnsaved()
    await deleteCarouselUnsaved()
}

const handleCreated = (editor) => {
    editorRef.value = editor
}

const submitAdd = () => {
    goodsRef.value.validate(async (valid) => {
        if (valid){
            let params = {
                goodsCategoryId: state.categoryId,
                goodsCoverImg: state.goodsForm.goodsCoverImg,
                goodsCarousel: state.goodsForm.goodsCarousel.join(','),
                goodsDetailContent: valueHtml.value,
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
            // 提交之后需要检查之前上传的图片是否还存在当前的内容中，如果不存在则需要删除
            await deleteImgsDiff()
            await deleteCoversDiff()
            await deleteCarouselDiff()
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

const handleCoverUrlSuccess = async (val) => {
    state.goodsForm.goodsCoverImg = val.data || ''
    coverHistory.push(val.data)
}

const handleCarouselUrlSuccess = async (val) => {
    if (val){
        state.goodsForm.goodsCarousel.push(val.data)
        carouselHistory.push(val.data)
    }
}

const handleChangeCate = (val) => {
    state.categoryId = val[2] || 0
}

// 因为上传图片是立即上传的
// 所以提交之后需要处理不存在的图片
const deleteImgsDiff = async () => {
    imagesCurrent = editorRef.value.getElemsByType('image').map(item => item.src)
    const imagesDiff = imagesHistory.concat(imagesCurrent).filter(v => imagesHistory.includes(v) && !imagesCurrent.includes(v))
    // console.log('imagesDiff', imagesDiff)
    if (imagesDiff.length > 0){
        const params = {
            urls: imagesDiff
        }
        await deleteFiles(params)
    }
    imagesOrigin = imagesHistory = imagesCurrent
}

const deleteImgsUnsaved = async () => {
    const imagesUnsaved = imagesHistory.filter(v => !imagesOrigin.includes(v))
    if (imagesUnsaved.length > 0){
        const params = {
            urls: imagesUnsaved
        }
        await deleteFiles(params)
    }
}

const deleteCoversDiff = async () => {
    coverCurrent = [state.goodsForm.goodsCoverImg]
    const coverDiff = coverHistory.concat(coverCurrent).filter(v => coverHistory.includes(v) && !coverCurrent.includes(v))
    if (coverDiff.length > 0){
        const params = {
            urls: coverDiff
        }
        await deleteFiles(params)
    }
    coverOrigin = coverHistory = coverCurrent
}

const deleteCoversUnsaved = async () => {
    const coversUnsaved = coverHistory.filter(v => !coverOrigin.includes(v))
    if (coversUnsaved.length > 0){
        const params = {
            urls: coversUnsaved
        }
        await deleteFiles(params)
    }
}

const deleteCarouselDiff = async () => {
    carouselCurrent = [].concat(state.goodsForm.goodsCarousel)
    const carouselDiff = carouselHistory.concat(carouselCurrent).filter(v => carouselHistory.includes(v) && !carouselCurrent.includes(v))
    // console.log(carouselDiff)
    if (carouselDiff.length > 0){
        const params = {
            urls: carouselDiff
        }
        await deleteFiles(params)
    }
    carouselOrigin = carouselHistory = carouselCurrent
}

const deleteCarouselUnsaved = async () => {
    const carouselUnsaved = carouselHistory.filter(v => !carouselOrigin.includes(v))
    // console.log(carouselUnsaved)
    if (carouselUnsaved.length > 0){
        const params = {
            urls: carouselUnsaved
        }
        await deleteFiles(params)
    }
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
.toolbar{
    border-bottom: 1px solid #ccc
}
.editor{
    width: 100%;
    height: 1000px!important;
}
</style>
