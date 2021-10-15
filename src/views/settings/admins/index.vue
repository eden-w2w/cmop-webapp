<template>
    <d2-container>
        <template slot="header">
            <el-row type="flex" justify="space-between" align="middle">
                <el-col :span="3">管理员设置</el-col>
                <el-col :span="3" style="text-align: right">
                    <el-button type="primary" @click="onAddAdmin">创建管理员</el-button>
                </el-col>
            </el-row>
        </template>

        <el-empty v-if="!loading && !dataList.length"></el-empty>
        <el-table v-else v-loading="loading" :data="dataList" style="width: 100%" stripe>
            <el-table-column prop="administratorsID" label="管理员编号" width="200"></el-table-column>
            <el-table-column prop="userName" label="管理员用户名"></el-table-column>
            <el-table-column prop="createdAt" label="创建时间">
                <template slot-scope="scope">
                    {{ formatDatatime(scope.row.createdAt) }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link type="primary" @click="onResetPassword($event, scope.row.administratorsID, scope.row.userName)">重置密码</el-link> |
                    <el-link type="danger" @click="onRemove($event, scope.row.administratorsID, scope.row.userName)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <el-drawer title="创建管理员" :visible.sync="showAddAdmin" direction="rtl" ref="adminPanel" size="35%">
            <div class="dipatch-pannel__content">
                <el-form :model="adminForm">
                    <el-form-item label="用户名">
                        <el-input v-model="adminForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input show-password v-model="adminForm.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dipatch-pannel__footer">
                <el-button @click="$refs.adminPanel.closeDrawer()">取 消</el-button>
                <el-button type="primary" @click="onAddAdminSubmit" :loading="loading">提交</el-button>
            </div>
        </el-drawer>
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
            dataList: [],
            showAddAdmin: false,
            adminForm: {
                userName: '',
                password: ''
            }
        }
    },
    mounted() {
        this.loadingAdmins()
    },
    methods: {
        ...format,
        loadingAdmins() {
            this.loading = true
            api.getAdmins().then(res => {
                this.loading = false
                this.dataList = res
            })
        },

        onAddAdmin() {
            this.showAddAdmin = true
        },

        onResetPassword(evt, id, name) {
            this.$prompt('即将重置管理员 ' + name + ' 的密码，请输入新的密码', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showInput: true,
                inputValidator: function (val) {
                    if (!val) {
                        return '请输入密码'
                    }
                    return true
                }
            })
                .then(({ value }) => {
                    api.resetPassword({
                        adminID: id,
                        password: value
                    }).then(res => {
                        this.$message({
                            message: '密码已重置',
                            type: 'success'
                        })
                        this.reload()
                    })
                })
                .catch(() => {})
        },

        onRemove(evt, id, name) {
            this.$confirm('此操作将永久删除管理员 ' + name + ', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {})
                .catch(() => {})
        },

        onAddAdminSubmit() {
            api.createAdmins(this.adminForm).then(res => {
                this.$message({
                    message: '成功创建管理员',
                    type: 'success'
                })
                this.reload()
            })
        }
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
