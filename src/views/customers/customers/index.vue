<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">客户管理</el-col>
                <el-col :span="20" style="text-align: right">
                    <el-select
                        style="width: 300px"
                        v-model="search.userID"
                        filterable
                        remote
                        clearable
                        placeholder="请输入昵称或OpenID"
                        :remote-method="onSearchUserID"
                        :loading="loadingUser"
                        @change="onSearchSelectChange"
                    >
                        <el-option v-for="u in userList" :key="u.userID" :label="u.nickName" :value="u.userID">
                            <span style="float: left">{{ u.nickName }}</span>
                            <span style="float: right">
                                <el-tag size="mini">{{ u.openID }}</el-tag>
                            </span>
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </template>

        <el-empty v-if="!loading && !listData.length"></el-empty>
        <el-table v-else v-loading="loading" :data="listData" style="width: 100%" stripe>
            <el-table-column prop="userID" label="用户编号" width="200">
                <template slot-scope="item">
                    <el-link @click="onUserDetail($event, item.row.userID)">{{ item.row.userID }}<i class="el-icon-view el-icon--right"></i></el-link>
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="openID" label="微信OpenID"></el-table-column>
            <el-table-column prop="unionID" label="微信UnionID"></el-table-column>
            <el-table-column prop="refererID" label="推荐人">
                <template slot-scope="item">
                    <el-link v-if="item.row.refererID != '0'" @click="onUserDetail($event, item.row.userID)"
                        >{{ item.row.refererID }}<i class="el-icon-view el-icon--right"></i
                    ></el-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="size" :total="total" hide-on-single-page> </el-pagination>
        </div>
    </d2-container>
</template>

<script>
import userApi from '@/api/modules/sys.user'

export default {
    name: 'customers_customers',
    inject: ['reload'],
    data() {
        return {
            search: {
                userID: ''
            },
            userList: [],
            loadingUser: false,
            loading: true,
            listData: [],
            total: 0,
            size: 10
        }
    },
    mounted() {
        userApi.getUsers({}).then(res => {
            this.listData = res.data
            this.total = res.total
            this.loading = false
        })
    },
    methods: {
        onSearchUserID(query) {
            this.loadingUser = true
            userApi.getUserByKeywords(query).then(res => {
                this.loadingUser = false
                this.userList = res
            })
        },

        onSearchSelectChange() {
            this.loading = true
            userApi.getUsers(this.search).then(res => {
                this.listData = res.data
                this.total = res.total
                this.loading = false
            })
        },

        onUserDetail(evt, userID) {
            this.$router.push({
                path: '/customers/customer_detail',
                query: {
                    userID
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
