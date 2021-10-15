<template>
    <div class="upload-container">
        <el-button
            :style="{ background: color, borderColor: color }"
            icon="el-icon-upload"
            size="mini"
            type="primary"
            @click="dialogVisible = true"
        >
            上传
        </el-button>
        <el-dialog :visible.sync="dialogVisible">
            <el-upload
                :multiple="true"
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :http-request="onUploadRequest"
                class="editor-slide-upload"
                action="https://httpbin.org/post"
                list-type="picture-card"
            >
                <el-button size="small" type="primary"> 点击上传 </el-button>
            </el-upload>
            <el-button @click="dialogVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </el-dialog>
    </div>
</template>

<script>
import api from "@/api/modules/sys.productions";
import { Message } from "element-ui";

export default {
    name: "EditorSlideUpload",
    props: {
        color: {
            type: String,
            default: "#1890ff",
        },
    },
    data() {
        return {
            dialogVisible: false,
            listObj: {},
            fileList: [],
        };
    },
    methods: {
        checkAllSuccess() {
            return Object.keys(this.listObj).every(
                (item) => this.listObj[item].hasSuccess
            );
        },

        onUploadRequest: function (params) {
            var reader = new FileReader();
            let $this = this;
            reader.readAsDataURL(params.file);
            reader.onload = function () {
                let flag = "base64,";
                let i = reader.result.indexOf(flag);
                let result = reader.result.substr(i + flag.length);
                api.upload({
                    key: "productions/" + params.file.name,
                    data: result,
                }).then((res) => {
                    $this.handleSuccess(res, params.file);
                });
            };
        },
        handleSubmit() {
            const arr = Object.keys(this.listObj).map((v) => this.listObj[v]);
            if (!this.checkAllSuccess()) {
                this.$message(
                    "Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!"
                );
                return;
            }
            this.$emit("successCBK", arr);
            this.listObj = {};
            this.fileList = [];
            this.dialogVisible = false;
        },
        handleSuccess(response, file) {
            const uid = file.uid;
            const objKeyArr = Object.keys(this.listObj);
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    this.listObj[objKeyArr[i]].url = response.url;
                    this.listObj[objKeyArr[i]].hasSuccess = true;
                    return;
                }
            }
            Message.success({
                message: "上传成功",
                type: "success",
            });
        },
        handleRemove(file) {
            const uid = file.uid;
            const objKeyArr = Object.keys(this.listObj);
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    delete this.listObj[objKeyArr[i]];
                    return;
                }
            }
        },
        beforeUpload(file) {
            const _self = this;
            const _URL = window.URL || window.webkitURL;
            const fileName = file.uid;
            this.listObj[fileName] = {};
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = _URL.createObjectURL(file);
                img.onload = function () {
                    _self.listObj[fileName] = {
                        hasSuccess: false,
                        uid: file.uid,
                        width: this.width,
                        height: this.height,
                    };
                };
                resolve(true);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
    margin-bottom: 20px;
    ::v-deep .el-upload--picture-card {
        width: 100%;
    }
}
</style>
