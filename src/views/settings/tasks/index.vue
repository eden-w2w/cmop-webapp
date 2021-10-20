<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">任务调度列表</el-row>
        </template>

        <el-empty v-if="!loading && !dataList.length"></el-empty>
        <el-table v-else v-loading="loading" :data="dataList" style="width: 100%" stripe>
            <el-table-column prop="flowID" label="日志ID" width="200"></el-table-column>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag :type="taskFlowStatusColor(scope.row.status)" effect="dark">{{ taskFlowStatus(scope.row.status) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="startedAt" label="开始时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.startedAt) }}
                </template>
            </el-table-column>
            <el-table-column prop="endedAt" label="结束时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.endedAt) }}
                </template>
            </el-table-column>
            <el-table-column prop="message" label="任务上报信息"></el-table-column>
        </el-table>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.user'
import format from '@/libs/util.format'

export default {
    name: 'settings_administrators',
    inject: ['reload'],
    data() {
        return {
            loading: false,
            search: {
                startTimeGte: '',
                startTimeLt: '',
                status: ''
            },
            dataList: [],
            total: 0,
            size: 10
        }
    },
    mounted() {
        this.loadingFlows()
    },
    methods: {
        ...format,
        loadingFlows() {
            this.loading = true
            api.getTaskFlows(this.search).then(res => {
                this.loading = false
                this.dataList = res.data
                this.total = res.total
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.dipatch-pannel__content {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.dipatch-pannel__footer {
    display: flex;
    padding: 20px;
}
.dipatch-pannel__footer button {
    flex: 1;
}
</style>
