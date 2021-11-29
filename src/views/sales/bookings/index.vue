<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="2">预售单列表</el-col>
                <el-col :span="21" style="text-align: right">
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
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onAddBooking">创建预售单</el-button>
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
            <el-table-column prop="eta" label="预计到货时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.eta">{{ formatDatatime(scope.row.eta) }}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-link :disabled="loadingDetail" v-if="scope.row.status != 'COMPLETE'" type="primary" style="margin-right: 10px" @click="onBookingEdit(scope.row.flowID)"
                        >编辑</el-link
                    >
                    <el-link v-if="scope.row.status == 'READY'" type="success" style="margin-right: 10px" @click="onBookingStart(scope.row.flowID)"
                        >开始</el-link
                    >
                    <el-link v-if="scope.row.status == 'PROCESS'" type="warning" style="margin-right: 10px" @click="onBookingComplete(scope.row.flowID)"
                        >完成</el-link
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

        <el-drawer title="预售单" :visible.sync="showPanel" direction="rtl" ref="panel" size="50%">
            <div class="goods-pannel__content">
                <el-form :model="detail" ref="bookingForm" label-width="100px">
                    <el-form-item label="商品编号">
                        <el-input v-model="detail.goodsID"></el-input>
                    </el-form-item>
                    <el-form-item label="预售销量">
                        <el-input v-model.number="detail.sales"></el-input>
                    </el-form-item>
                    <el-form-item label="预售限量">
                        <el-input v-model.number="detail.limit"></el-input>
                    </el-form-item>
                    <el-form-item label="预售模式">
                        <el-tag type="success">{{ bookingType(detail.type) }}</el-tag>
                    </el-form-item>
                    <el-form-item label="预售状态">
                        <el-tag :type="bookingStatusColor(detail.status)">{{ bookingStatus(detail.status) }}</el-tag>
                    </el-form-item>
                    <el-form-item label="预售时间段">
                        <el-date-picker
                            v-model="bookingTimeRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                            @input="onBookingTimeChange"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="预计到货时间">
                        <el-date-picker v-model="detail.eta" type="date" placeholder="选择日期" value-format="yyyy-MM-ddTHH:mm:ss+08:00"></el-date-picker>
                    </el-form-item>
                    <el-button type="primary" @click="onSaveBooking">保存</el-button>
                </el-form>
            </div>
        </el-drawer>
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
            loading: false,
            listData: [],
            total: 0,
            showPanel: false,
            loadingDetail: false,
            detail: {
                goodsID: '',
                sales: null,
                limit: null,
                type: 'MANUAL',
                status: 'READY',
                startTime: '',
                endTime: '',
                eta: ''
            },
            bookingTimeRange: []
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
        loadData: function () {
            this.loading = true
            api.getBookingFlows(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },
        resetDetail() {
            this.detail = {
                goodsID: '',
                sales: null,
                limit: null,
                type: 'MANUAL',
                status: 'READY',
                startTime: '',
                endTime: '',
                eta: ''
            }
            this.bookingTimeRange = []
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
        },
        onAddBooking() {
            this.resetDetail()
            this.showPanel = true
        },
        onBookingTimeChange() {
            if (this.bookingTimeRange && this.bookingTimeRange.length == 2 && this.bookingTimeRange[0] && this.bookingTimeRange[1]) {
                this.detail.startTime = this.bookingTimeRange[0]
                this.detail.endTime = this.bookingTimeRange[1]
            } else {
                this.detail.startTime = ''
                this.detail.endTime = ''
            }
            this.$forceUpdate()
        },
        onBookingEdit(id) {
            this.loadingDetail = true
            api.getBookingFlowByID(id)
                .then(detail => {
                    this.loadingDetail = false
                    this.detail = detail
                    this.bookingTimeRange.push(detail.startTime)
                    this.bookingTimeRange.push(detail.endTime)
                    this.showPanel = true
                })
                .catch(() => {})
        },
        onBookingStart(id) {
            this.$confirm('此操作将开启预售单 (' + id + ')，商品立刻进入预订状态，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.startBookingFlow(id)
                    .then(() => {
                        this.$message({
                            message: '已开启预售',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        onBookingComplete(id) {
            this.$confirm('此操作将结束预售单 (' + id + ')，若商品库存不足将显示无货，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.completeBookingFlow(id)
                    .then(() => {
                        this.$message({
                            message: '已完成预售',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            })
        },
        onSaveBooking() {
            if (this.detail.flowID) {
                // 更新
                api.updateBookingFlow(this.detail.flowID, this.detail)
                    .then(() => {
                        this.$message({
                            message: '已更新预售',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            } else {
                // 创建
                api.createBookingFlow(this.detail)
                    .then(() => {
                        this.$message({
                            message: '已创建预售',
                            type: 'success'
                        })
                        this.reload()
                    })
                    .catch(() => {})
            }
        }
    },
    computed: {}
}
</script>

<style lang="scss" scoped>
.goods-pannel__content {
    padding: 20px;
}
</style>
