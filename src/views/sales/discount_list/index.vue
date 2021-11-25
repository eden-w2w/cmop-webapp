<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">营销活动列表</el-col>
                <el-col :span="20" style="text-align: right">
                    <el-select v-model="search.type" placeholder="营销类型" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.discountType" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-select v-model="search.status" placeholder="营销状态" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.discountStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-select v-model="search.cal" placeholder="计算方式" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.discountCal" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onCreate">创建活动</el-button>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length">
            <el-button type="primary" @click="onCreate">创建活动</el-button>
        </el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table">
            <el-table-column prop="discountID" label="活动编号" width="200"></el-table-column>
            <el-table-column prop="name" label="活动名称" width="200"></el-table-column>
            <el-table-column prop="type" label="活动类型">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ discountType(scope.row.type) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="cal" label="计算方式">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark">{{ discountCal(scope.row.cal) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="活动状态">
                <template slot-scope="scope">
                    <el-tag :type="discountStatusColor(scope.row.status)" effect="dark">{{ discountStatus(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="有效期" width="300">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.validityStart, 'yyyy-MM-dd') }} 至 {{ formatDatatime(scope.row.validityEnd, 'yyyy-MM-dd') }}
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-link style="margin-right: 10px" type="primary" @click="onEdit(scope.row.discountID)">编辑</el-link>
                    <el-link
                        v-if="scope.row.status == 'READY' || scope.row.status == 'STOP'"
                        style="margin-right: 10px"
                        type="success"
                        @click="onStart(scope.row.discountID)"
                        >启动</el-link
                    >
                    <el-link v-if="scope.row.status == 'PROCESS'" style="margin-right: 10px" type="warning" @click="onStop(scope.row.discountID)">停止</el-link>
                    <el-link v-if="scope.row.status == 'STOP' || scope.row.status == 'READY'" type="danger" @click="onDelete(scope.row.discountID)"
                        >删除</el-link
                    >
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                layout="prev, pager, next"
                :page-size="search.size"
                :total="total"
                hide-on-single-page
                @current-change="onPageChange"
            ></el-pagination>
        </div>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import format from '@/libs/util.format'

export default {
    name: 'sales_discount_list',
    inject: ['reload'],
    data() {
        return {
            enums: {},
            search: {
                type: '',
                status: '',
                cal: '',
                size: 10,
                offset: 0
            },
            loading: true,
            listData: [],
            total: 0
        }
    },
    mounted() {
        api.enums().then(res => {
            this.enums = res
        })
        this.loadData()
    },
    methods: {
        ...format,
        onCreate() {
            this.$router.push({
                path: '/sales/discounts/save'
            })
        },
        onEdit(id) {
            this.$router.push({
                path: '/sales/discounts/save',
                query: {
                    discountID: id
                }
            })
        },
        onStart(id) {
            api.startDiscount(id)
                .then(() => {
                    this.$message({
                        message: '启动成功',
                        type: 'success'
                    })
                    this.reload()
                })
                .catch(() => {})
        },
        onStop(id) {
            this.$confirm('此操作将停止活动 (' + id + ') ，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.stopDiscount(id)
                    .then(() => {
                        this.$message({
                            message: '已停止活动',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        onDelete(id) {
            this.$confirm('此操作将永久删除该活动 (' + id + ') ，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteDiscount(id)
                    .then(() => {
                        this.$message({
                            message: '已删除活动',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        loadData() {
            this.loading = true
            api.getDiscounts(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },
        onSearchSelectChange() {
            this.loadData()
        },
        onEditOrder(evt, orderID) {
            this.$router.push({
                path: '/sales/save',
                query: {
                    orderID
                }
            })
        },
        onPageChange(pageNo) {
            this.search.offset = (pageNo - 1) * this.search.size
            this.onSearchSelectChange()
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
