<template>
    <d2-container>
        <el-form ref="form" :model="goods" label-width="100px">
            <el-form-item label="商品名称">
                <el-input v-model="goods.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input v-model="goods.comment"></el-input>
            </el-form-item>
            <el-form-item label="发货地">
                <el-input v-model="goods.dispatchAddr"></el-input>
            </el-form-item>
            <el-form-item label="规格">
                <el-input v-model="goods.specifications"></el-input>
            </el-form-item>
            <el-form-item label="活动">
                <el-input v-model="goods.activities"></el-input>
            </el-form-item>
            <el-form-item label="物流政策">
                <el-input v-model="goods.logisticPolicy"></el-input>
            </el-form-item>
            <el-form-item label="库存">
                <el-input v-model="goods.inventory"></el-input>
            </el-form-item>
            <el-form-item label="当前销量">
                <el-input v-model="goods.sales"></el-input>
            </el-form-item>
            <el-form-item label="价格">
                <el-input v-model="goods.price"></el-input>
            </el-form-item>
            <el-form-item label="详细介绍">
                <d2-ueditor v-model="goods.detail"></d2-ueditor>
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

export default {
    name: "productions_detail",
    data() {
        return {
            isUpdate: false,
            goods: {},
        };
    },
    mounted() {
        const id = this.$route.query.goodsID;
        if (!id) {
            // 创建
            this.isUpdate = false;
        } else {
            // 更新
            this.isUpdate = true;
            api.getGoodsByID(id).then((res) => {
                this.goods = res;
            });
        }
    },
    methods: {
        ...format,
        onSubmit: function() {
            
        }
    },
    computed: {},
};
</script>

<style lang="scss" scoped>
.money {
    font-size: 16px;
    font-weight: bold;
    color: #ff0000;
}
.money:before {
    content: "￥";
}
</style>
