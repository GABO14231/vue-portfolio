import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import fs from 'fs'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig
({
    plugins: [vue(), vueDevTools()],
    resolve:{alias: {'@': fileURLToPath(new URL('./src', import.meta.url))}},
    server:
    {
        https:
        {
            key: fs.readFileSync(path.resolve("../https_certs/vue_portfolio-key.pem")),
            cert: fs.readFileSync(path.resolve("../https_certs/vue_portfolio.pem"))
        }
    }
})