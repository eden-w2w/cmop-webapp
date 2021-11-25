<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="2">预售单列表</el-col>
                <el-col :span="24" style="text-align: right">
                    <el-input
                        v-model="search.goodsID"
                        placeholder="商品编号"
                        clearable
                        @change="onSearchSelectChange"
                        style="width: 200px; margin-left: 10px"
                    ></el-input>
                    <el-select v-model="search.type" placeholder="预售单类型" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.bookingType" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-select v-model="search.status" placeholder="预售单状态" clearable @change="onSearchSelectChange" style="margin-left: 10px">
                        <el-option v-for="s in enums.bookingStatus" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                    <el-date-picker
                        style="margin-left: 10px"
                        v-model="startTimeRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="启动日期>="
                        end-placeholder="启动日期<"
                        :picker-options="pickerOptions"
                        @change="onSearchSelectChange"
                    >
                    </el-date-picker>
                    <el-date-picker
                        style="margin-left: 10px"
                        v-model="endTimeRange"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="结束日期>="
                        end-placeholder="结束日期<"
                        :picker-options="pickerOptions"
                        @change="onSearchSelectChange"
                    >
                    </el-date-picker>
                </el-col>
            </el-row>
        </template>
        <el-empty v-if="!loading && !listData.length"></el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe ref="table">
            <el-table-column prop="flowID" label="预售单号" width="200"></el-table-column>
            <el-table-column prop="goodsID" label="商品编号" width="200">
                <template slot-scope="item">
                    <el-link @click="onShowGoods(item.row.goodsID)">{{ item.row.goodsID }}<i class="el-icon-view el-icon--right"></i></el-link>
                </template>
            </el-table-column>
            <el-table-column prop="sales" label="预售销量"></el-table-column>
            <el-table-column prop="limit" label="预售限量"></el-table-column>
            <el-table-column prop="type" label="预售类型">
                <template slot-scope="scope">
                    <el-tag :type="bookingTypeColor(scope.row.type)" effect="dark">{{ bookingType(scope.row.type) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="预售状态">
                <template slot-scope="scope">
                    <el-tag :type="bookingStatusColor(scope.row.status)" effect="dark">{{ bookingStatus(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.startTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.endTime">{{ formatDatatime(scope.row.endTime) }}</span>
                    <span v-else>-</span>
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
    name: 'sales_list',
    inject: ['reload'],
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            enums: {},
            search: {
                goodsID: '',
                type: '',
                status: '',
                startTimeBegin: '',
                startTimeEnd: '',
                endTimeBegin: '',
                endTimeEnd: '',
                size: 10,
                offset: 0
            },
            startTimeRange: [],
            endTimeRange: [],
            loading: true,
            listData: [],
            total: 0
        }
    },
    mounted() {
        const { goodsID, status } = this.$route.query
        if (goodsID) {
            this.search.goodsID = goodsID
        }
        if (status) {
            this.search.status = status
        }
        api.enums().then(res => {
            this.enums = res
        })
        this.loadData()
    },
    methods: {
        ...format,
        loadData: function() {
            this.loading = true
            api.getBookingFlows(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },
        onShowGoods(goodsID) {
            this.$router.push({
                path: '/productions/save',
                query: {
                    goodsID
                }
            })
        },
        onSearchSelectChange() {
            if (this.startTimeRange && this.startTimeRange.length == 2 && this.startTimeRange[0] && this.startTimeRange[1]) {
                this.search.startTimeBegin = this.getLocalISOTime(this.startTimeRange[0])
                this.search.startTimeEnd = this.getLocalISOTime(this.startTimeRange[1])
            } else {
                this.search.startTimeBegin = ''
                this.search.startTimeEnd = ''
            }
            if (this.endTimeRange && this.endTimeRange.length == 2 && this.endTimeRange[0] && this.endTimeRange[1]) {
                this.search.endTimeBegin = this.getLocalISOTime(this.endTimeRange[0])
                this.search.endTimeEnd = this.getLocalISOTime(this.endTimeRange[1])
            } else {
                this.search.endTimeBegin = ''
                this.search.endTimeEnd = ''
            }
            this.loadData()
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
