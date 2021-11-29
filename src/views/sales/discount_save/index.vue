<template>
    <d2-container>
        <template slot="header">创建/编辑活动信息</template>
        <el-steps :active="activeStep" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="规则配置"></el-step>
            <el-step title="确认"></el-step>
        </el-steps>

        <div v-if="activeStep === 0">
            <el-form style="margin-top: 50px" ref="form0" :model="discount" :rules="rules0" label-width="150px">
                <el-form-item label="活动名称" prop="name">
                    <el-input v-model="discount.name"></el-input>
                </el-form-item>
                <el-form-item label="活动类型" prop="type">
                    <el-select :disabled="isUpdate" clearable v-model="discount.type" placeholder="活动类型">
                        <el-option v-for="s in enums.discountType" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计算方式" prop="cal">
                    <el-select :disabled="isUpdate" clearable v-model="discount.cal" placeholder="计算方式">
                        <el-option v-for="s in enums.discountCal" :key="s.value" :label="s.label" :value="s.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-tag :type="discountStatusColor(discount.status)" effect="dark">{{ discountStatus(discount.status) }}</el-tag>
                </el-form-item>
                <el-form-item label="有效期" prop="validityTime">
                    <el-date-picker
                        v-model="discount.validityTime"
                        type="daterange"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @input="onValidityTimeChange"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="单用户优惠次数上限" prop="userLimit">
                    <el-input-number v-model="discount.userLimit" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="总优惠次数上限" prop="limit">
                    <el-input-number v-model="discount.limit" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="已优惠次数" prop="times">
                    <el-input-number :disabled="!isUpdate" v-model="discount.times" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="优惠金额上限" prop="discountLimit">
                    <el-input v-model="discountLimit" @input="onDiscountLimitInput">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeStep === 1">
            <el-form style="margin-top: 50px" ref="form1" :model="discount" :rules="rules1" label-width="150px">
                <el-form-item v-if="discount.cal == 'UNIT'" label="总价满额单价优惠阈值" prop="minTotalPrice">
                    <el-input v-model="minTotalPrice" @input="onMinTotalPriceInput">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="discount.type == 'ALL_PERCENT' && discount.cal == 'UNIT'" label="单价折扣比例" prop="discountRate">
                    <el-input-number v-model="discount.discountRate" :min="0.01" :max="1" :step="0.01"></el-input-number>
                </el-form-item>
                <el-form-item v-if="discount.type == 'ALL_PERCENT' && (discount.cal == 'MULTISTEP' || discount.cal == 'MULTISTEP_UNIT')" label="总价阶梯式折扣" prop="multiStepRate">
                    <div v-for="step in discount.multiStepRate" :key="step.id" style="margin-bottom: 10px">
                        <el-form inline :model="step">
                            <el-form-item label="最小总价" prop="min">
                                <el-input v-model.number="step.minShadow" placeholder="最小总价" @change="onMultiPriceChange(step, 'minShadow', 'min')">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="是否无上限总价" prop="noMax">
                                <el-switch v-model="step.noMax" active-text="无上限" inactive-text="有上限"> </el-switch>
                            </el-form-item>
                            <el-form-item label="最大总价" prop="max" v-if="!step.noMax">
                                <el-input v-model.number="step.maxShadow" placeholder="最大总价" @change="onMultiPriceChange(step, 'maxShadow', 'max')">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="折扣" prop="rate">
                                <el-input-number v-model.number="step.rate" :min="0.01" :max="1" :step="0.01"></el-input-number>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-delete" @click="onDeleteMultiStepRate(step.id)"></el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-button @click="onAddMultiStepRate">添加规则</el-button>
                </el-form-item>

                <el-form-item v-if="discount.type == 'ALL' && discount.cal == 'UNIT'" label="单价立减金额" prop="discountAmount">
                    <el-input v-model="discountAmount" @input="onDiscountAmountInput">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="discount.type == 'ALL' && (discount.cal == 'MULTISTEP' || discount.cal == 'MULTISTEP_UNIT')" label="总价阶梯式立减" prop="multiStepReduction">
                    <div v-for="step in discount.multiStepReduction" :key="step.id" style="margin-bottom: 10px">
                        <el-form inline :model="step">
                            <el-form-item label="最小总价" prop="min">
                                <el-input v-model.number="step.minShadow" placeholder="最小总价" @change="onMultiPriceChange(step, 'minShadow', 'min')">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="是否无上限总价" prop="noMax">
                                <el-switch v-model="step.noMax" active-text="无上限" inactive-text="有上限"> </el-switch>
                            </el-form-item>
                            <el-form-item label="最大总价" prop="max" v-if="!step.noMax">
                                <el-input v-model.number="step.maxShadow" placeholder="最大总价" @change="onMultiPriceChange(step, 'maxShadow', 'max')">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="立减" prop="reduction">
                                <el-input v-model.number="step.reductionShadow" @change="onMultiPriceChange(step, 'reductionShadow', 'reduction')">
                                    <template slot="prepend">￥</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" icon="el-icon-delete" @click="onDeleteMultiStepReduction(step.id)"></el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-button @click="onAddMultiStepReduction">添加规则</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-if="activeStep === 2">
            <el-descriptions title="活动信息确认" :column="1" border>
                <el-descriptions-item>
                    <template slot="label">活动名称</template>
                    {{ discount.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">活动类型</template>
                    <el-tag effect="dark">{{ discountType(discount.type) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">计算类型</template>
                    <el-tag effect="dark">{{ discountCal(discount.cal) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">活动状态</template>
                    <el-tag :type="discountStatusColor(discount.status)" effect="dark">{{ discountStatus(discount.status) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">有效期</template>
                    {{ formatDatatime(discount.validityStart, 'yyyy-MM-dd') }} 至 {{ formatDatatime(discount.validityEnd, 'yyyy-MM-dd') }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">单用户优惠次数上限</template>
                    <span v-if="discount.userLimit">{{ discount.userLimit }}</span>
                    <span v-else>无上限</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">总优惠次数上限</template>
                    <span v-if="discount.limit">{{ discount.limit }}</span>
                    <span v-else>无上限</span>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">已优惠次数</template>
                    {{ discount.times }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">优惠金额上限</template>
                    <span v-if="discount.discountLimit">￥{{ formatMoney(discount.discountLimit / 100) }}元</span>
                    <span v-else>无上限</span>
                </el-descriptions-item>
                <el-descriptions-item v-if="discount.cal == 'UNIT'">
                    <template slot="label">总价满额单价优惠阈值</template>
                    <span v-if="discount.minTotalPrice">￥{{ formatMoney(discount.minTotalPrice / 100) }}元</span>
                    <span v-else>无上限</span>
                </el-descriptions-item>
                <el-descriptions-item v-if="discount.type == 'ALL_PERCENT' && discount.cal == 'UNIT'">
                    <template slot="label">单价折扣比例</template>
                    {{ discount.discountRate }}
                </el-descriptions-item>
                <el-descriptions-item v-if="discount.type == 'ALL_PERCENT' && (discount.cal == 'MULTISTEP' || discount.cal == 'MULTISTEP_UNIT')">
                    <template slot="label">总价阶梯式折扣</template>
                    <div v-for="step in discount.multiStepRate" :key="step.id">
                        ￥{{ formatMoney(step.minShadow) }}元 ~ {{step.noMax ? '无上限' : '￥' + formatMoney(step.maxShadow) + '元'}}，{{ step.rate }}折扣率
                    </div>
                </el-descriptions-item>
                <el-descriptions-item v-if="discount.type == 'ALL' && discount.cal == 'UNIT'">
                    <template slot="label">单价立减金额</template>
                    ￥{{ formatMoney(discount.discountAmount / 100) }}元
                </el-descriptions-item>
                <el-descriptions-item v-if="discount.type == 'ALL' && (discount.cal == 'MULTISTEP' || discount.cal == 'MULTISTEP_UNIT')">
                    <template slot="label">总价阶梯式立减</template>
                    <div v-for="step in discount.multiStepReduction" :key="step.id">
                        ￥{{ formatMoney(step.minShadow) }}元 ~ {{step.noMax ? '无上限' : '￥' + formatMoney(step.maxShadow) + '元'}}，立减￥{{ formatMoney(step.reductionShadow) }}元
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div style="margin-top: 50px">
            <el-button v-if="activeStep > 0" type="primary" @click="onPrevStep">上一步</el-button>
            <el-button v-if="activeStep < 2" type="primary" @click="onNextStep">下一步</el-button>
            <el-button v-if="activeStep === 2" type="primary" @click="onSubmit">提交</el-button>
        </div>
    </d2-container>
</template>

<script>
import api from '@/api/modules/sys.sales'
import format from '@/libs/util.format'
import Decimal from 'decimal.js'
import { v4 } from 'uuid'

export default {
    name: 'sales_discount_save',
    data() {
        return {
            activeStep: 0,
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
            rules0: {
                name: [
                    {
                        required: true,
                        message: '请填写活动名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 255,
                        message: '长度在 255 个字符以内',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择活动类型',
                        trigger: 'blur'
                    }
                ],
                cal: [
                    {
                        required: true,
                        message: '请选择计算方式',
                        trigger: 'blur'
                    }
                ],
                validityTime: [
                    {
                        type: 'array',
                        required: true,
                        len: 2,
                        message: '有效期格式错误',
                        trigger: 'blur'
                    }
                ],
                userLimit: [
                    {
                        type: 'integer',
                        message: '必须是数字',
                        trigger: 'blur'
                    },
                    {
                        type: 'integer',
                        min: 0,
                        message: '至少大于等于 0',
                        trigger: 'blur'
                    }
                ],
                limit: [
                    {
                        type: 'integer',
                        message: '必须是数字',
                        trigger: 'blur'
                    },
                    {
                        type: 'integer',
                        min: 0,
                        message: '至少大于等于 0',
                        trigger: 'blur'
                    }
                ],
                times: [
                    {
                        type: 'integer',
                        message: '必须是数字',
                        trigger: 'blur'
                    },
                    {
                        type: 'integer',
                        min: 0,
                        message: '至少大于等于 0',
                        trigger: 'blur'
                    }
                ],
                discountLimit: [
                    {
                        type: 'integer',
                        message: '请输入合法的金额，例如 150.00',
                        trigger: 'blur'
                    },
                    {
                        type: 'integer',
                        min: 0,
                        message: '至少大于等于 0',
                        trigger: 'blur'
                    }
                ]
            },
            rules1: {
                discountRate: [
                    {
                        type: 'float',
                        min: 0.01,
                        max: 1,
                        message: '请填写正确的折扣率，如 0.88 代表88折',
                        trigger: 'blur'
                    }
                ],
                multiStepRate: [
                    {
                        type: 'array',
                        min: 1,
                        trigger: 'blur',
                        defaultField: {
                            type: 'object',
                            fields: {
                                min: [
                                    {
                                        type: 'integer',
                                        required: true,
                                        min: 0,
                                        message: '请输入合法的最小总价金额，例如 150.00',
                                        trigger: 'blur'
                                    }
                                ],
                                max: [
                                    {
                                        type: 'integer',
                                        message: '请输入合法的最大总价金额，例如 150.00',
                                        trigger: 'blur'
                                    }
                                ],
                                rate: [
                                    {
                                        type: 'float',
                                        required: true,
                                        min: 0.01,
                                        max: 1,
                                        message: '请填写正确的折扣率，如 0.88 代表88折',
                                        trigger: 'blur'
                                    }
                                ]
                            }
                        }
                    }
                ],
                discountAmount: [
                    {
                        type: 'integer',
                        required: true,
                        min: 0,
                        message: '请输入合法的金额，例如 150.00',
                        trigger: 'blur'
                    }
                ],
                multiStepReduction: [
                    {
                        type: 'array',
                        min: 1,
                        trigger: 'blur',
                        defaultField: {
                            type: 'object',
                            fields: {
                                min: [
                                    {
                                        type: 'integer',
                                        required: true,
                                        min: 0,
                                        message: '请输入合法的最小总价金额，例如 150.00',
                                        trigger: 'blur'
                                    }
                                ],
                                max: [
                                    {
                                        type: 'integer',
                                        required: true,
                                        min: 1,
                                        message: '请输入合法的最大总价金额，例如 150.00',
                                        trigger: 'blur'
                                    }
                                ],
                                reduction: [
                                    {
                                        type: 'integer',
                                        required: true,
                                        min: 0,
                                        message: '请输入合法的立减金额，例如 150.00',
                                        trigger: 'blur'
                                    }
                                ]
                            }
                        }
                    }
                ]
            },
            loading: false,
            isUpdate: false,
            enums: {},
            discount: {
                discountID: '',
                name: '',
                type: '',
                cal: '',
                status: 'READY',
                validityTime: [],
                validityStart: '',
                validityEnd: '',
                userLimit: 0,
                limit: 0,
                times: 0,
                discountLimit: 0,
                minTotalPrice: 0,
                discountRate: 0.0,
                multiStepRate: [],
                discountAmount: 0,
                multiStepReduction: []
            },
            discountLimit: 0.0,
            discountAmount: 0.0,
            minTotalPrice: 0.0
        }
    },
    mounted() {
        const id = this.$route.query.discountID
        if (id) {
            this.isUpdate = true
            this.loading = true
            api.getDiscountByID(id).then(res => {
                this.loading = false
                this.discount = res
                this.discount.validityTime = [new Date(this.discount.validityStart), new Date(this.discount.validityEnd)]
                this.discountLimit = new Decimal(res.discountLimit).div(new Decimal(100)).toFixed(2)
                if (this.discount.discountAmount) {
                    this.discountAmount = new Decimal(res.discountAmount).div(new Decimal(100)).toFixed(2)
                }
                if (this.discount.minTotalPrice) {
                    this.minTotalPrice = new Decimal(res.minTotalPrice).div(new Decimal(100)).toFixed(2)
                }
                if (this.discount.multiStepRate) {
                    for (let i = 0; i < this.discount.multiStepRate.length; i++) {
                        this.discount.multiStepRate[i].id = v4()
                        this.discount.multiStepRate[i].minShadow = new Decimal(this.discount.multiStepRate[i].min).div(new Decimal(100)).toFixed(2)
                        this.discount.multiStepRate[i].maxShadow = new Decimal(this.discount.multiStepRate[i].max).div(new Decimal(100)).toFixed(2)
                    }
                }
                if (this.discount.multiStepReduction) {
                    for (let i = 0; i < this.discount.multiStepReduction.length; i++) {
                        this.discount.multiStepReduction[i].id = v4()
                        this.discount.multiStepReduction[i].minShadow = new Decimal(this.discount.multiStepReduction[i].min).div(new Decimal(100)).toFixed(2)
                        this.discount.multiStepReduction[i].maxShadow = new Decimal(this.discount.multiStepReduction[i].max).div(new Decimal(100)).toFixed(2)
                        this.discount.multiStepReduction[i].reductionShadow = new Decimal(this.discount.multiStepReduction[i].reduction)
                            .div(new Decimal(100))
                            .toFixed(2)
                    }
                }
            })
        } else {
            this.isUpdate = false
            this.discount.status = 'READY'
        }
        api.enums().then(res => {
            this.enums = res
        })
    },
    methods: {
        ...format,

        getLocalISOTime(twDate) {
            var d = new Date(twDate)
            var utcd = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())

            let localOffset = d.getTimezoneOffset() * 60000 + 8 * 60 * 60000
            var newdate = new Date(utcd + localOffset)
            return newdate.toISOString().replace('.000', '')
        },

        onDiscountLimitInput: function (val) {
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            this.discount.discountLimit = d.toNumber()
        },

        onDiscountAmountInput: function (val) {
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            this.discount.discountAmount = d.toNumber()
        },

        onDiscountLimitInput: function (val) {
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            this.discount.discountLimit = d.toNumber()
        },

        onMinTotalPriceInput: function (val) {
            let d = new Decimal(val)
            d = d.mul(new Decimal(100))
            this.discount.minTotalPrice = d.toNumber()
        },

        onMultiPriceChange: function (rule, shadow, origin) {
            rule[origin] = new Decimal(rule[shadow]).mul(new Decimal(100)).toNumber()
        },

        onValidityTimeChange: function (val) {
            if (this.discount.validityTime && this.discount.validityTime.length == 2 && this.discount.validityTime[0] && this.discount.validityTime[1]) {
                this.discount.validityStart = this.getLocalISOTime(this.discount.validityTime[0])
                this.discount.validityEnd = this.getLocalISOTime(this.discount.validityTime[1])
            } else {
                this.discount.validityStart = ''
                this.discount.validityEnd = ''
            }
            this.$forceUpdate()
        },

        onNextStep: function () {
            if (this.activeStep > 1) {
                return
            }
            this.$refs['form' + this.activeStep].validate(valid => {
                if (valid) {
                    this.activeStep++
                }
            })
        },

        onPrevStep: function () {
            if (this.activeStep > 0) {
                this.activeStep--
            }
        },

        onAddMultiStepRate: function () {
            this.discount.multiStepRate.push({
                id: v4(),
                min: 0,
                minShadow: 0.0,
                max: 0,
                maxShadow: 0.0,
                noMax: false,
                rate: 0.01
            })
        },

        onDeleteMultiStepRate: function (id) {
            this.discount.multiStepRate.splice(
                this.discount.multiStepRate.findIndex(item => item.id === id),
                1
            )
        },

        onAddMultiStepReduction: function () {
            this.discount.multiStepReduction.push({
                id: v4(),
                min: 0,
                minShadow: 0.0,
                max: 0,
                maxShadow: 0.0,
                noMax: false,
                reduction: 100,
                reductionShadow: 1
            })
        },

        onDeleteMultiStepReduction: function (id) {
            this.discount.multiStepReduction.splice(
                this.discount.multiStepReduction.findIndex(item => item.id === id),
                1
            )
        },

        onSubmit() {
            if (!this.discount.discountID) {
                api.createDiscount(this.discount)
                    .then(() => {
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        })
                    })
                    .catch(() => {})
            } else {
                api.updateDiscount(this.discount.discountID, this.discount)
                    .then(() => {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
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
