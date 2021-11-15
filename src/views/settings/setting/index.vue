<template>
    <d2-container>
        <template slot="header">系统设置</template>

        <el-form ref="form" :model="setting" :rules="rules" label-width="100px">
            <el-form-item label="推荐有礼分享标题图片" prop="promotionMainPicture">
                <el-upload action="" class="main-picture-uploader" :show-file-list="false" :http-request="onUploadRequest">
                    <el-image
                        class="main-picture"
                        fit="cover"
                        v-if="setting.promotionMainPicture"
                        :src="setting.promotionMainPicture"
                        :preview-src-list="[setting.promotionMainPicture]"
                    >
                        <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                    </el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.user'
import prodApi from '@/api/modules/sys.productions'
import format from '@/libs/util.format'
import { Message } from 'element-ui'

export default {
    name: 'settings_administrators',
    inject: ['reload'],
    data() {
        return {
            rules: {
                promotionMainPicture: [
                    {
                        type: 'url',
                        required: true,
                        trigger: 'blur',
                        message: '请输入合法的图片URL地址'
                    }
                ]
            },
            loading: false,
            setting: {
                promotionMainPicture: ''
            }
        }
    },
    mounted() {
        this.loading = true
        api.getSetting()
            .then(res => {
                this.setting = res
                this.loading = false
            })
            .catch(() => {})
    },
    methods: {
        ...format,

        onUploadRequest: function (params) {
            var reader = new FileReader()
            let $this = this
            reader.readAsDataURL(params.file)
            reader.onload = function () {
                let flag = 'base64,'
                let i = reader.result.indexOf(flag)
                let result = reader.result.substr(i + flag.length)
                prodApi.upload({
                    key: 'productions/' + params.file.name,
                    data: result
                }).then(res => {
                    console.log(res)
                    $this.setting.promotionMainPicture = res.url
                    Message.success({
                        message: '上传成功',
                        type: 'success'
                    })
                })
            }
        },

        onSubmit: function () {
            let $this = this
            this.$refs['form'].validate(valid => {
                console.log($this.setting)
                if (valid) {
                    api.updateSetting($this.setting).then(res => {
                        $this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                    })
                } else {
                    $this.$message({
                        message: '表单数据不完整',
                        type: 'error'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
