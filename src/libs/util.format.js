export default {
    formatDatatime: (time, format = 'yyyy-MM-dd hh:mm:ss') => {
        let date = new Date(time);
        var o = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1, // 月份 "d+": value.getDate(), // 日
            'd+': date.getDate(),
            'h+': date.getHours(), // 小时 "m+": value.getMinutes(), // 分 "s+": value.getSeconds(), // 秒
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return format;
    },
    formatMoney: (str) => {
        if (!str) {
            return "0.00";
        }
        str = str.toString();
        if (!str) return;

        if (str.indexOf(".") === -1) {
            str += ".00";
        } else {
            var decimal = str.split(".");
            if (decimal[1] < 11) {
                str = decimal[0] + "." + (decimal[1] + "0");
            }
        }

        var arr = str.split(".");
        var left = arr[0];

        left = left.replace(new RegExp("B(?=(d{3})+$)", "g"), ",");
        return left + "." + arr[1];
    },
    orderStatus: (status) => {
        switch (status) {
            case 'CREATED':
                return '待支付';
            case 'PAID':
                return '待确认';
            case 'CONFIRM':
                return '待发货';
            case 'DISPATCH':
                return '已发货';
            case 'COMPLETE':
                return '已完成';
            case 'REFUND':
                return '退款中';
            case 'CLOSED':
                return '已关闭';
        }
    },
    orderStatusColor: (status) => {
        switch (status) {
            case 'CREATED':
                return 'info';
            case 'PAID':
                return '';
            case 'CONFIRM':
                return '';
            case 'DISPATCH':
                return 'warning';
            case 'COMPLETE':
                return 'success';
            case 'REFUND':
                return 'warning';
            case 'CLOSED':
                return 'danger';
        }
    },
    paymentMethod: (p) => {
        switch (p) {
            case 'WECHAT':
                return '微信支付';
        }
    },
    settlementStatus: status => {
        switch (status) {
            case 'CREATED':
                return '待结算';
            case 'COMPLETE':
                return '已结算';
        }
    },
    settlementStatusColor: status => {
        switch (status) {
            case 'CREATED':
                return 'warning';
            case 'COMPLETE':
                return 'success';
        }
    }
}