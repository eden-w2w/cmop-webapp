<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">{{ goods.name }}</el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button
                        type="primary"
                        :disabled="btnDisabled"
                        @click="onUpdateClick"
                        >编辑商品</el-button
                    >
                </el-col>
            </el-row>
        </template>
        <el-descriptions :column="1" border>
            <el-descriptions-item label="描述">{{
                goods.comment
            }}</el-descriptions-item>
            <el-descriptions-item label="发货地">{{
                goods.dispatchAddr
            }}</el-descriptions-item>
            <el-descriptions-item label="规格">
                <el-row v-for="spec in goods.specifications" v-bind:key="spec">
                    <el-tag size="mini">{{ spec }}</el-tag>
                </el-row>
            </el-descriptions-item>
            <el-descriptions-item label="活动">
                <el-row v-for="act in goods.activities" v-bind:key="act">
                    <el-tag size="mini">{{ act }}</el-tag>
                </el-row>
            </el-descriptions-item>
            <el-descriptions-item label="物流政策">{{
                goods.logisticPolicy
            }}</el-descriptions-item>
            <el-descriptions-item label="库存">{{
                goods.inventory
            }}</el-descriptions-item>
            <el-descriptions-item label="当前销量">{{
                goods.sales
            }}</el-descriptions-item>
            <el-descriptions-item label="价格">
                <span class="money">{{ formatMoney(goods.price / 100) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ goods.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
                {{ goods.updatedAt }}
            </el-descriptions-item>
            <el-descriptions-item label="详细介绍">
                <div v-html="goods.detail"></div>
            </el-descriptions-item>
        </el-descriptions>
    </d2-container>
</template>

<script>
import api from "@/api/modules/sys.productions";
import format from "@/libs/util.format";
import { Message } from "element-ui";

export default {
    name: "productions_detail",
    data() {
        return {
            btnDisabled: false,
            goods: {},
        };
    },
    mounted() {
        const id = this.$route.query.goodsID;
        if (!id) {
            // 显示提示
            Message({
                message: "无法获取所需的商品",
                type: "error",
                duration: 5 * 1000,
            });
            btnDisabled = true;
            return;
        }
        api.getGoodsByID(id).then((res) => {
            this.goods = res;
        });
    },
    methods: {
        ...format,
        onUpdateClick: function () {
            this.$router.push({
                path: "/productions/save",
                query: {
                    goodsID: this.goods.goodsID,
                },
            });
        },
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
