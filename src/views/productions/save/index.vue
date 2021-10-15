<template>
    <d2-container>
        <el-form ref="form" :model="goods" :rules="rules" label-width="100px">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="goods.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="comment">
                <el-input v-model="goods.comment"></el-input>
            </el-form-item>
            <el-form-item label="发货地" prop="dispatchAddr">
                <el-input v-model="goods.dispatchAddr"></el-input>
            </el-form-item>
            <el-form-item label="规格" prop="specifications">
                <el-select
                    v-model="goods.specifications"
                    multiple
                    filterable
                    allow-create
                    placeholder="请选择规格"
                    style="width: 100%"
                >
                    <el-option
                        v-for="spec in specifications"
                        :key="spec"
                        :label="spec"
                        :value="spec"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动" prop="activities">
                <el-select
                    v-model="goods.activities"
                    multiple
                    filterable
                    allow-create
                    placeholder="请选择活动"
                    style="width: 100%"
                >
                    <el-option
                        v-for="spec in activities"
                        :key="spec"
                        :label="spec"
                        :value="spec"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物流政策" prop="logisticPolicy">
                <el-input v-model="goods.logisticPolicy"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="inventory">
                <el-input v-model.number="goods.inventory"></el-input>
            </el-form-item>
            <el-form-item label="当前销量" prop="sales">
                <el-input v-model.number="goods.sales"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model="price" @input="onPriceInput">
                    <template slot="prepend">￥</template>
                </el-input>
            </el-form-item>
            <el-form-item label="主要图片" prop="mainPicture">
                <el-upload
                    action=""
                    class="main-picture-uploader"
                    :show-file-list="false"
                    :http-request="onMainPicUploadRequest"
                >
                    <el-image
                        class="main-picture"
                        fit="cover"
                        v-if="goods.mainPicture"
                        :src="goods.mainPicture"
                        :preview-src-list="[goods.mainPicture]"
                    >
                        <div slot="placeholder" class="image-slot">
                            加载中<span class="dot">...</span>
                        </div>
                    </el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="轮播图片" prop="pictures">
                <el-upload
                    action=""
                    list-type="picture-card"
                    :file-list="goods.pictures"
                    :http-request="onPicUploadRequest"
                >
                    <i class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }">
                        <el-image
                            style="width: 146px; height: 146px"
                            fit="cover"
                            :src="file.url"
                            :preview-src-list="[file.url]"
                        >
                            <div slot="placeholder" class="image-slot">
                                加载中<span class="dot">...</span>
                            </div>
                        </el-image>
                        <span class="el-upload-list__item-actions">
                            <span
                                class="el-upload-list__item-delete"
                                @click="onPictureRemove(file)"
                            >
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="详细介绍" prop="detail">
                <tinymce v-model="goods.detail" :height="1000" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </d2-container>
</template>

<script>
import api from "@/api/modules/sys.productions";
import format from "@/libs/util.format";
import { Message } from "element-ui";
import Schema from "async-validator";
import Tinymce from "@/components/Tinymce";
import Decimal from 'decimal.js'

export default {
    name: "productions_detail",
    data() {
        return {
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 30,
                        message: "长度在 3 到 30个字符之间",
                        trigger: "blur",
                    },
                ],
                comment: [
                    {
                        max: 255,
                        message: "长度在 255 个字符以内",
                        trigger: "blur",
                    },
                ],
                dispatchAddr: [
                    {
                        required: true,
                        message: "请输入商品发货地",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 30,
                        message: "长度在 2 到 30个字符之间",
                        trigger: "blur",
                    },
                ],
                specifications: [
                    {
                        type: "array",
                        required: true,
                        message: "请输入商品规格",
                        trigger: "blur",
                    },
                    {
                        type: "array",
                        min: 1,
                        message: "请至少填写 1 项商品规格",
                        trigger: "blur",
                    },
                ],
                logisticPolicy: [
                    {
                        max: 255,
                        message: "长度在 255 个字符以内",
                        trigger: "blur",
                    },
                ],
                inventory: [
                    {
                        type: "integer",
                        required: true,
                        message: "请输入商品库存",
                        trigger: "blur",
                    },
                    {
                        type: "integer",
                        min: 0,
                        message: "商品销量必须大于等于 0",
                        trigger: "blur",
                    },
                ],
                sales: [
                    {
                        type: "integer",
                        required: true,
                        message: "请输入商品销量",
                        trigger: "blur",
                        pattern: /^\d+$/
                    },
                    {
                        type: "integer",
                        min: 0,
                        message: "商品销量必须大于等于 0",
                        trigger: "blur",
                    },
                ],
                price: [
                    {
                        type: "integer",
                        required: true,
                        trigger: "blur",
                        message: '请输入合法的金额，例如 150.00',
                    },
                    {
                        type: "integer",
                        min: 1,
                        message: "金额必须大于 0.01",
                        trigger: "blur",
                    },
                ],
                mainPicture: [
                    {
                        type: "url",
                        required: true,
                        trigger: "blur",
                        message: "请输入合法的图片URL地址",
                    },
                ],
                pictures: [
                    {
                        type: "array",
                        required: true,
                        message: "请上传商品展示图",
                        trigger: "blur",
                    },
                    {
                        type: "array",
                        min: 1,
                        message: "请至少上传 1 项商品展示图",
                        trigger: "blur",
                    },
                ],
                detail: [
                    {
                        required: true,
                        message: "请填写商品详情",
                        trigger: "blur",
                    },
                    {
                        max: 65535,
                        message: "长度在 65535 个字符以内",
                        trigger: "blur",
                    },
                ],
            },
            price: 0.0,
            specifications: [],
            activities: [],
            goods: {
                goodsID: '',
                name: '',
                comment: '',
                activities: [],
                specifications: [],
                dispatchAddr: '',
                inventory: 0,
                sales: 0,
                mainPicture: '',
                pictures: [],
                price: 0,
                logisticPolicy: '',
                detail: '',
            },
        };
    },
    mounted() {
        const id = this.$route.query.goodsID;
        if (!id) {
            // 创建
        } else {
            // 更新
            api.getGoodsByID(id).then((res) => {
                this.goods = res;
                this.price = this.formatMoney(this.goods.price / 100);
                this.specifications = res.specifications;
                this.activities = res.activities;
            });
        }
    },
    methods: {
        ...format,
        onSubmit: function () {
            console.log(this.goods);
            let $this = this;
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    api.updateGoods($this.goods).then((res) => {
                        $this.$message({
                            message: "保存成功",
                            type: "success",
                        });
                    });
                } else {
                    $this.$message({
                        message: "表单数据不符合规范",
                        type: "error",
                    });
                }
            });
        },
        onPriceInput: function (val) {
            let d = new Decimal(val);
            d = d.mul(new Decimal(100));
            this.goods.price = d.toNumber();
        },
        onPictureRemove: function (file) {
            for (let i = 0; i < this.goods.pictures.length; i++) {
                const v = this.goods.pictures[i];
                if (file.uid == v.uid) {
                    this.goods.pictures.splice(i, 1);
                    break;
                }
            }
        },
        onMainPicUploadRequest: function (params) {
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
                    $this.goods.mainPicture = res.url;
                    Message.success({
                        message: "上传成功",
                        type: "success",
                    });
                });
            };
        },

        onPicUploadRequest: function (params) {
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
                    let maxI = 0;
                    $this.goods.pictures.forEach((v, i) => {
                        if (v.id > maxI) {
                            maxI = v.id;
                        }
                    });
                    $this.goods.pictures.push({
                        id: maxI + 1,
                        status: "success",
                        type: "IMAGE",
                        uid: params.file.uid,
                        url: res.url,
                    });
                    Message.success({
                        message: "上传成功",
                        type: "success",
                    });
                });
            };
        },
    },
    computed: {},
    components: {
        Tinymce,
    },
};
</script>

<style>
.money {
    font-size: 16px;
    font-weight: bold;
    color: #ff0000;
}
.money:before {
    content: "￥";
}
.main-picture-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.main-picture-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.main-picture {
    width: 178px;
    height: 178px;
    display: block;
}
.el-upload-list--picture-card .el-upload-list__item-actions {
    width: 50%;
    left: 50%;
}
</style>
