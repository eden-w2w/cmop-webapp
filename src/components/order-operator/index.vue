<template>
    <span>
        <el-button type="danger" @click="onCancelOrder($event, id)" v-if="show && status == 'CREATED'">取消订单</el-button>
        <el-button type="warning" @click="onConfirmOrder($event, id)" v-if="show && status == 'PAID'">确认收款</el-button>
        <el-button type="success" @click="onDispatchOrder($event, id)" v-if="show && status == 'CONFIRM'">发货</el-button>
        <el-button type="warning" @click="onCompleteOrder($event, id)" v-if="show && status == 'DISPATCH'">确认收货</el-button>
        <el-button type="danger" @click="onRefundOrder($event, id)" v-if="show && (status == 'DISPATCH' || status == 'COMPLETE')">退货</el-button>
        <el-button type="danger" @click="onDrawback($event, id)" v-if="show && (status == 'PAID' || status == 'CONFIRM' || status == 'REFUND')">确认退款</el-button>
        <el-drawer title="填写物流信息" :visible.sync="showDispatchPanel" direction="rtl" ref="dispatchPanel" size="35%">
            <div class="dipatch-pannel__content">
                <el-form :model="dispatchForm">
                    <el-form-item label="快递公司">
                        <el-input v-model="dispatchForm.courierCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="dispatchForm.courierNumber"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dipatch-pannel__footer">
                <el-button @click="$refs.dispatchPanel.closeDrawer()">取 消</el-button>
                <el-button type="primary" @click="onDispatchSubmit">提交</el-button>
            </div>
        </el-drawer>
    </span>
</template>

<script>
import api from '@/api/modules/sys.sales'

export default {
    name: 'order-operator',
    inject: ['reload'],
    data: function () {
        return {
            showDispatchPanel: false,
            currentOrder: 0,
            dispatchForm: {
                courierCompany: '',
                courierNumber: ''
            }
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        onCancelOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将永久取消该订单 (' + orderID + ') 并且无法恢复, 请再次确定已与客户提前沟通，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.cancelOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onDrawback(evt, orderID) {
            let $this = this
            this.$confirm('由于目前系统未对接微信支付退款，此操作将永久取消该订单 (' + orderID + ') 并且无法恢复, 请再次确定已与客户提前沟通，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.cancelOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onConfirmOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (待发货), 请再次确定已收到客户付款，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.confirmOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onDispatchOrder(evt, orderID) {
            this.currentOrder = orderID
            this.showDispatchPanel = true
        },
        onDispatchSubmit(evt) {
            if (!this.currentOrder) {
                return
            }
            let $this = this
            api.dispatchOrder({
                orderID: this.currentOrder,
                courierCompany: this.dispatchForm.courierCompany,
                courierNumber: this.dispatchForm.courierNumber
            }).then(() => {
                $this.$refs.dispatchPanel.closeDrawer()
                $this.reload()
            })
        },
        onCompleteOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (已完成), 建议该操作由客户自主完成，请再次确认客户已收到商品，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.completeOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        },
        onRefundOrder(evt, orderID) {
            let $this = this
            this.$confirm('此操作将对订单 (' + orderID + ') 状态标记为 (退款中), 建议该操作由客户自主发起，请再次确认客户已退货，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.refundOrder(orderID).then(() => {
                    $this.reload()
                })
            })
        }
    },
    computed: {}
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