<template>
  <div class="root" ref="root"></div>
</template>

<script>
import Vue from "vue";
import { Root, rootStateEnum, structRender } from "../core";
import ImcTable from "./components/ImcTable";

export default {
  data() {
    return {
      data: Object.freeze(JSON.parse(localStorage.getItem("data")))
    };
  },
  mounted() {
    this.root = new Root({
      el: this.$refs.root,
      state: rootStateEnum.off,
      renderContent: (host, node) => {
        console.log(host, node);
        if (host.domHost) {
          const Table = Vue.extend(ImcTable);
          new Table().$mount(host.domHost);
        }
      }
    });
    this.data &&
      structRender(this.data, {
        root: this.root,
        preview: true
      });
  }
};
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
}
</style>
