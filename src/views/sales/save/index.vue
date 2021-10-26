<template>
    <d2-container>
        <template slot="header">创建/编辑订单 </template>
        <el-form ref="form" :model="order" :rules="rules" label-width="100px">
            <el-divider content-position="left">基本信息</el-divider>
            <el-form-item label="所属用户" prop="userID">
                <el-select
                    style="width: 300px"
                    v-model="order.userID"
                    filterable
                    remote
                    clearable
                    placeholder="请输入昵称或OpenID"
                    :remote-method="onSearchUserID"
                    :loading="loadingUser"
                    :disabled="isUpdate"
                >
                    <el-option v-for="u in userList" :key="u.userID" :label="u.nickName" :value="u.userID">
                        <span style="float: left">{{ u.nickName }}</span>
                        <span style="float: right">
                            <el-tag size="mini">{{ u.openID }}</el-tag>
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单总额" prop="totalPrice">
                <el-input disabled :value="formatMoney(order.totalPrice / 100)"><template slot="prepend">￥</template></el-input>
            </el-form-item>
            <el-form-item label="优惠金额" prop="discountAmount">
                <el-input :disabled="isNotModifyAmount" v-model="discountAmount" @input="onDiscountAmountInput"
                    ><template slot="prepend">￥</template></el-input
                >
            </el-form-item>
            <el-form-item label="实际金额" prop="actualAmount">
                <el-input disabled :value="formatMoney(order.actualAmount / 100)"><template slot="prepend">￥</template></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
                <el-select :disabled="isUpdate" clearable v-model="order.paymentMethod" placeholder="支付方式">
                    <el-option v-for="s in enums.paymentMethod" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="order.remark" :autosize="{ minRows: 1, maxRows: 5 }"></el-input>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
                <el-tag :type="orderStatusColor(order.status)" effect="dark">{{ orderStatus(order.status) }}</el-tag>
            </el-form-item>

            <el-divider content-position="left">物流信息</el-divider>
            <el-form-item label="收件人" prop="recipients">
                <el-input v-model="order.recipients"></el-input>
            </el-form-item>
            <el-form-item label="收货地址" prop="shippingAddr">
                <el-input v-model="order.shippingAddr"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="order.mobile"></el-input>
            </el-form-item>
            <el-form-item label="快递公司" prop="courierCompany">
                <el-input v-model="order.courierCompany"></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="courierNumber">
                <el-input v-model="order.courierNumber"></el-input>
            </el-form-item>

            <el-divider content-position="left">商品列表</el-divider>
            <el-form-item label="" prop="goods">
                <el-table :v-loading="loading" :data="order.goods" style="width: 100%" stripe>
                    <el-table-column prop="goodsID" label="商品编号" width="100"></el-table-column>
                    <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
                    <el-table-column prop="specifications" label="规格">
                        <template slot-scope="scope">
                            <el-row v-for="spec in scope.row.specifications" v-bind:key="spec">
                                <el-tag size="mini">{{ spec }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="activities" label="参与活动">
                        <template slot-scope="scope">
                            <el-row v-for="spec in scope.row.activities" v-bind:key="spec">
                                <el-tag size="mini">{{ spec }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="价格">
                        <template slot-scope="scope">
                            <span class="money">{{ formatMoney(scope.row.price / 100) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总价格">
                        <template slot-scope="scope">
                            <span class="money">{{ formatMoney((scope.row.amount * scope.row.price) / 100) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="数量">
                        <template slot-scope="scope">
                            <el-input-number :disabled="isNotModifyAmount" @change="onAmountChange" v-model="scope.row.amount" :min="1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot="header">
                            <el-button type="primary" round @click="onAddGoods">添加商品</el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-link :disabled="isNotModifyAmount" type="danger" @click="onRemoveGoods(scope.row.goodsID)">移除</el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-divider content-position="left">订单操作</el-divider>
            <el-button type="primary" @click="onSubmitOrder">保存订单</el-button>
            <order-operator style="margin-left: 10px" :id="order.orderID" :status="order.status" :show="isUpdate"></order-operator>
        </el-form>
        <el-drawer title="商品列表" :visible.sync="showGoodsPanel" direction="rtl" ref="goodsPanel" size="60%">
            <div class="goods-pannel__content">
                <el-empty v-if="!loadingGoods && !goodsList.length"></el-empty>
                <el-table v-else v-loading="loadingGoods" :data="goodsList" style="width: 100%" stripe @row-click="onGoodsClick">
                    <el-table-column prop="goodsID" label="商品编号" width="100"></el-table-column>
                    <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
                    <el-table-column prop="sales" label="销量" width="100"></el-table-column>
                    <el-table-column prop="inventory" label="库存" width="100"></el-table-column>
                    <el-table-column prop="specifications" label="规格">
                        <template slot-scope="scope">
                            <el-row v-for="spec in scope.row.specifications" v-bind:key="spec">
                                <el-tag size="mini">{{ spec }}</el-tag>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column prop="activities" label="参与活动">
                        <template slot-scope="scope">
                            <el-row v-for="spec in scope.row.activities" v-bind:key="spec">
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
            </div>
        </el-drawer>
    </d2-container>
</template>

<script>
import OrderOperator from '@/components/order-operator'
import api from '@/api/modules/sys.sales'
import userApi from '@/api/modules/sys.user'
import prodApi from '@/api/modules/sys.productions'
import format from '@/libs/util.format'
import Decimal from 'decimal.js'

export default {
    name: 'sales_save',
    components: { OrderOperator },
    data() {
        return {
            rules: {
                userID: [
                    {
                        required: true,
                        message: '请选择所属用户',
                        trigger: 'blur'
                    }
                ],
                paymentMethod: [
                    {
                        required: true,
                        message: '请选择支付方式',
                        trigger: 'blur'
                    }
                ],
                remark: [
                    {
                        min: 2,
                        max: 255,
                        message: '长度在 255 个字符以内',
                        trigger: 'blur'
                    }
                ],
                recipients: [
                    {
                        required: true,
                        message: '请输入收件人',
                        trigger: 'blur'
                    }
                ],
                shippingAddr: [
                    {
                        required: true,
                        message: '请输入收件地址',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }
                ],
                goods: [
                    {
                        type: 'array',
                        required: true,
                        message: '请添加商品',
                        trigger: 'blur'
                    },
                    {
                        type: 'array',
                        min: 1,
                        message: '请至少添加 1 件商品',
                        trigger: 'blur'
                    }
                ]
            },
            loading: false,
            isUpdate: false,
            isNotModifyAmount: false,
            userList: [],
            loadingUser: false,
            enums: {},
            order: {
                orderID: '',
                status: '',
                goods: []
            },
            discountAmount: '0.00',
            showGoodsPanel: false,

            loadingGoods: false,
            goodsList: []
        }
    },
    mounted() {
        const id = this.$route.query.orderID
        if (id) {
            // 更新
            this.isUpdate = true
            this.loading = true
            api.getOrderByID(id).then(res => {
                this.order = res
                this.loading = false
                this.discountAmount = this.formatMoney(this.order.discountAmount / 100)
                this.userList.push({
                    userID: res.userID,
                    nickName: res.nickName,
                    openID: res.openID
                })
                if (this.order.status != 'CREATED') {
                    this.isNotModifyAmount = true
                } else {
                    this.isNotModifyAmount = false
                }
            })
        } else {
            this.isUpdate = false
            this.order.status = 'CREATED'
            this.isNotModifyAmount = false
        }
        api.enums().then(res => {
            this.enums = res
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

        onDiscountAmountInput(val) {
            let reg = /^\d+(\.\d{1,2})?$/i
            if (!reg.test(val)) {
                return
            }
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            if (d.toNumber() > this.order.totalPrice) {
                return
            }
            this.order.discountAmount = d.toNumber()
            this.order.actualAmount = new Decimal(this.order.totalPrice).sub(new Decimal(this.order.discountAmount)).toNumber()
        },

        onAmountChange() {
            this.resetOrderPrice()
        },

        resetOrderPrice() {
            let totalPrice = new Decimal(0)
            for (const i in this.order.goods) {
                const g = this.order.goods[i]
                totalPrice = totalPrice.add(new Decimal(g.amount).mul(new Decimal(g.price)))
            }
            this.order.totalPrice = totalPrice.toNumber()
            this.order.actualAmount = totalPrice.sub(new Decimal(this.order.discountAmount)).toNumber()
        },

        onRemoveGoods(goodsID) {
            this.$confirm('此操作将移除 (' + goodsID + ') 商品，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.order.goods = this.order.goods.filter((g, i, goods) => {
                    return g.goodsID != goodsID
                })
                this.resetOrderPrice()
            })
        },

        onAddGoods() {
            if (this.isNotModifyAmount) {
                this.$message({
                    message: '订单状态不是 (待付款) 无法变更商品信息',
                    type: 'warning'
                })
                return
            }
            this.showGoodsPanel = true
            this.loadingGoods = true
            prodApi.getGoods().then(res => {
                this.goodsList = res
                this.loadingGoods = false
            })
        },

        onGoodsClick(row) {
            let g = this.order.goods.find((g, i, goods) => {
                if (g.goodsID == row.goodsID) {
                    return g
                }
            })
            if (!g) {
                this.order.goods.push({
                    goodsID: row.goodsID,
                    name: row.name,
                    price: row.price,
                    specifications: row.specifications,
                    activities: row.activities,
                    mainPicture: row.mainPicture,
                    amount: 1
                })
                this.resetOrderPrice()
            }
            this.$refs.goodsPanel.closeDrawer()
        },

        onSubmitOrder() {
            let $this = this
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (!$this.order.orderID) {
                        // api.createGoods($this.goods).then(res => {
                        //     $this.$message({
                        //         message: '创建成功',
                        //         type: 'success'
                        //     })
                        // })
                    } else {
                        api.updateOrder($this.order)
                            .then(res => {
                                $this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                            })
                            .catch(() => {})
                    }
                } else {
                    $this.$message({
                        message: '表单数据不完整',
                        type: 'error'
                    })
                }
            })
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
