<template>
  <d2-container>
    <template slot="header">销售统计</template>
  </d2-container>
</template>

<script>
import api from "@/api/modules/sys.productions";
import format from "@/libs/util.format";

export default {
  name: "sales_statistics",
  data() {
    return {
      loading: true,
      listData: [],
    };
  },
  mounted() {
  },
  methods: {
    ...format,
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.money {
  font-size: 16px;
  font-weight: bold;
  color: #ff0000;
}
.money:before {
  content: "￥";
}
</style>
