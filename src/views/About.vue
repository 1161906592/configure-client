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
          const div = document.createElement("div");
          host.domHost.appendChild(div);
          const Table = Vue.extend(ImcTable);
          new Table().$mount(div);
        }
      }
    });
    this.data &&
      structRender(this.data, {
        root: this.root,
        preview: true
      });
    const data = {
      id: "0faaf96f-3d25-a3f7-9899-6cef18d2e444",
      index: 0,
      distance: 0
    };
    const element = this.root.storage.getElementById(data.id);
    const pathElement = this.root.storage.getElementById(element.extData.tranformPathId);
    if (!pathElement) return;
    const curSection = pathElement.points.slice(data.index, data.index + 2);
    element.attr({
      x: curSection[0][0],
      y: curSection[0][1]
    });
    setInterval(() => {
      data.distance += 50;
      let b = data.distance / Math.sqrt((curSection[1][0] - curSection[0][0]) ** 2 + (curSection[1][1] - curSection[0][1]) ** 2);
      b = Math.min(1, b);
      element
        .animate("", false)
        .when(1000, {
          x: curSection[0][0] + (curSection[1][0] - curSection[0][0]) * b,
          y: curSection[0][1] + (curSection[1][1] - curSection[0][1]) * b
        })
        .start();
    }, 300);
  }
};
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
}
</style>
