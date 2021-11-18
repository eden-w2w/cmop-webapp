<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">商品列表</el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onCreateGoods">创建商品</el-button>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length">
            <el-button type="primary" @click="onCreateGoods">创建商品</el-button>
        </el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe @row-click="onTableRowClick">
            <el-table-column prop="goodsID" label="商品编号" width="100"></el-table-column>
            <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
            <el-table-column prop="sales" label="销量"></el-table-column>
            <el-table-column prop="inventory" label="库存"></el-table-column>
            <el-table-column prop="isAllowBooking" label="库存为空自动开启预售" width="200">
                <template slot-scope="item">
                    <el-tag v-if="item.row.isAllowBooking" type="success">是</el-tag>
                    <el-tag v-else>否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="bookingFlowID" label="预售单号" width="200">
                <template slot-scope="item">
                    <el-link v-if="item.row.bookingFlowID">{{ item.row.bookingFlowID }}<i class="el-icon-view el-icon--right"></i></el-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="bookingType" label="预售类型">
                <template slot-scope="item">
                    <el-tag v-if="item.row.bookingType" :type="bookingTypeColor(item.row.bookingType)" effect="dark">{{ bookingType(item.row.bookingType) }}</el-tag>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="bookingStatus" label="预售状态">
                <template slot-scope="item">
                    <el-tag v-if="item.row.bookingType" :type="bookingStatusColor(item.row.bookingStatus)" effect="dark">{{ bookingStatus(item.row.bookingStatus) }}</el-tag>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="bookingSales" label="预售销量"></el-table-column>
            <el-table-column prop="specifications" label="规格" width="200">
                <template slot-scope="scope">
                    <el-row v-for="spec in scope.row.specifications" v-bind:key="spec">
                        <el-tag size="mini">{{ spec }}</el-tag>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="价格">
                <template slot-scope="scope">
                    <span class="money">{{ formatMoney(scope.row.price / 100) }}</span>
                </template>
            </el-table-column>
        </el-table>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.productions'
import format from '@/libs/util.format'

export default {
    name: 'productions_list',
    data() {
        return {
            loading: false,
            listData: []
        }
    },
    mounted() {
        this.loading = true
        api.getGoods().then(res => {
            this.listData = res
            this.loading = false
        })
    },
    methods: {
        ...format,
        onCreateGoods() {
            this.$router.push({
                path: '/productions/save'
            })
        },
        onTableRowClick(row, col, evt) {
            this.$router.push({
                path: '/productions/save',
                query: {
                    goodsID: row.goodsID
                }
            })
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
.money {
    font-size: 16px;
    font-weight: bold;
    color: #ff0000;
}
.money:before {
    content: '￥';
}
</style>
