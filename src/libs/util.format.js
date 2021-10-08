export default {
    formatMoney: (str) => {
        if (!str) {
            return "";
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
}