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
            <el-table-column label="头像">
                <template slot-scope="item">
                    <el-avatar :size="50" :src="item.row.avatarUrl"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="openID" label="微信OpenID"></el-table-column>
            <el-table-column prop="unionID" label="微信UnionID"></el-table-column>
            <el-table-column prop="refererID" label="推荐人" width="200">
                <template slot-scope="item">
                    <el-link v-if="item.row.refererID != '0'" @click="onUserDetail($event, item.row.userID)"
                        >{{ item.row.refererID }}<i class="el-icon-view el-icon--right"></i
                    ></el-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.createdAt) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <el-link type="primary" @click="onShippingAddressPanel($event, item.row.userID)">管理收货地址</el-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :page-size="search.size" :total="total" hide-on-single-page @current-change="onPageChange">
            </el-pagination>
        </div>
        <el-drawer title="收货地址管理" :visible.sync="showPanel" direction="rtl" ref="goodsPanel" size="50%">
            <div class="goods-pannel__content">
                <el-empty v-if="!loadingShippingAddr && !shippingList.length"></el-empty>
                <el-table v-else v-loading="loadingShippingAddr" :data="shippingList" style="width: 100%" stripe>
                    <el-table-column prop="recipients" label="收件人" width="150"></el-table-column>
                    <el-table-column prop="mobile" label="联系电话" width="150"></el-table-column>
                    <el-table-column prop="district" label="省市区">
                        <template slot-scope="scope">
                            {{ scope.row.province }} / {{ scope.row.city }} / {{ scope.row.district }} / {{ scope.row.street }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="详细地址"></el-table-column>
                    <el-table-column prop="address" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="onUpdateAddress(scope.row)">编辑</el-link> |
                            <el-link type="danger" @click="onDeleteAddress(scope.row.userID, scope.row.shippingID)">删除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="margin-top: 20px" type="primary" @click="onShowAddAddress">添加收货地址</el-button>
            </div>
        </el-drawer>

        <el-dialog title="收货地址" :visible.sync="showAddAddress" v-if="showAddAddress">
            <el-form label-position="top" :model="addressForm">
                <el-form-item label="收件人姓名">
                    <el-input v-model="addressForm.recipients"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="addressForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        ref="addressCascader"
                        style="width: 300px"
                        v-model="districtDisplay"
                        :props="districtProps"
                        placeholder="请选择省/市/区/街道"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="addressForm.address"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddAddress = false">取消</el-button>
                <el-button type="primary" @click="onSaveAddress">确定</el-button>
            </div>
        </el-dialog>
    </d2-container>
</template>

<script>
import format from '@/libs/util.format'
import userApi from '@/api/modules/sys.user'
export default {
    name: 'customers_customers',
    inject: ['reload'],
    data() {
        return {
            search: {
                userID: '',
                size: 10,
                offset: 0
            },
            userList: [],
            loadingUser: false,
            loading: true,
            listData: [],
            total: 0,
            showPanel: false,
            loadingShippingAddr: false,
            shippingList: [],
            showAddAddress: false,
            currentUserID: '',
            addressForm: {
                userID: '',
                shippingID: '',
                recipients: '',
                mobile: '',
                address: ''
            },
            districtDisplay: [],
            districtProps: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { value } = node
                    userApi.getDistrict(value).then(res => {
                        if (res.length > 0) {
                            let nodes = []
                            for (const i in res[0].districts) {
                                let item = {
                                    value: res[0].districts[i].adcode,
                                    label: res[0].districts[i].name,
                                    leaf: false
                                }
                                if (res[0].districts[i].level == 'street') {
                                    item.value = res[0].districts[i].name
                                    item.leaf = true
                                }
                                nodes.push(item)
                            }
                            resolve(nodes)
                        }
                    })
                }
            }
        }
    },
    mounted() {
        userApi.getUsers(this.search).then(res => {
            this.listData = res.data
            this.total = res.total
            this.loading = false
        })
    },
    methods: {
        ...format,
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

        onPageChange(pageNo) {
            this.search.offset = (pageNo - 1) * this.search.size
            this.onSearchSelectChange()
        },

        onUserDetail(evt, userID) {
            this.$router.push({
                path: '/customers/customer_detail',
                query: {
                    userID
                }
            })
        },

        loadShippingAddress(userID) {
            userApi
                .getShippingAddress(userID)
                .then(res => {
                    this.loadingShippingAddr = false
                    this.shippingList = res
                })
                .catch(() => {})
        },

        onShippingAddressPanel(evt, userID) {
            this.currentUserID = userID
            this.showPanel = true
            this.loadingShippingAddr = true
            this.loadShippingAddress(userID)
        },

        onShowAddAddress() {
            this.showAddAddress = true
            this.resetAddressForm()
        },

        resetAddressForm() {
            this.addressForm = {
                userID: this.currentUserID,
                shippingID: '',
                recipients: '',
                mobile: '',
                province: '',
                provinceCode: '',
                city: '',
                cityCode: '',
                district: '',
                districtCode: '',
                street: '',
                streetCode: '',
                address: ''
            }
            this.districtDisplay = []
        },

        retrieveRegions(node, object) {
            if (!object) {
                object = new Object()
            }
            if (!node) {
                return object
            }
            if (!object.street) {
                object.street = node.label
                object.streetCode = node.value
                return this.retrieveRegions(node.parent, object)
            }
            if (!object.district) {
                object.district = node.label
                object.districtCode = node.value
                return this.retrieveRegions(node.parent, object)
            }
            if (!object.city) {
                object.city = node.label
                object.cityCode = node.value
                return this.retrieveRegions(node.parent, object)
            }
            if (!object.province) {
                object.province = node.label
                object.provinceCode = node.value
                return this.retrieveRegions(node.parent, object)
            }
            return object
        },

        onSaveAddress() {
            let node = this.$refs['addressCascader'].getCheckedNodes()
            if (node.length > 0) {
                let regions = this.retrieveRegions(node[0], null)
                this.addressForm = Object.assign(this.addressForm, regions)
            }
            if (this.addressForm.shippingID) {
                // update
                userApi
                    .updateShippingAddress(this.addressForm)
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        })
                        this.loadShippingAddress(this.addressForm.userID)
                        this.showAddAddress = false
                    })
                    .catch(() => {})
            } else {
                // create
                userApi
                    .createShippingAddress(this.addressForm)
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '创建成功'
                        })
                        this.loadShippingAddress(this.addressForm.userID)
                        this.showAddAddress = false
                    })
                    .catch(() => {})
            }
        },

        onUpdateAddress(row) {
            this.showAddAddress = true
            this.resetAddressForm()
            this.addressForm = {
                userID: this.currentUserID,
                shippingID: row.shippingID,
                recipients: row.recipients,
                mobile: row.mobile,
                province: row.province,
                provinceCode: row.provinceCode,
                city: row.city,
                cityCode: row.cityCode,
                district: row.district,
                districtCode: row.districtCode,
                street: row.street,
                streetCode: row.streetCode,
                address: row.address
            }
        },

        onDeleteAddress(userID, shippingID) {
            console.log(userID, ' ', shippingID)
            this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    userApi
                        .deleteShippingAddress({ userID, shippingID })
                        .then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            this.loadShippingAddress(userID)
                        })
                        .catch(() => {})
                })
                .catch(() => {})
        }
    }
}
</script>

<style lang="scss" scoped>
.goods-pannel__content {
    padding: 20px;
}
</style>
