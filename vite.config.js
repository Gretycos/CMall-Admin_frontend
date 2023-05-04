import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [ElementPlusResolver({
                importStyle: 'sass'
            })]
        }),
        ElementPlus()
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    base: './',
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1/admin', // 凡是遇到 /api 路径的请求，都映射到 target 属性
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
            }
        }
    },
    css: {
        preprocessorOptions: {
            // 覆盖掉element-plus包中的主题变量文件
            scss: {
                additionalData: `@use "@/common/style/element/index.scss" as *;`,
            },
        },
    },
})
