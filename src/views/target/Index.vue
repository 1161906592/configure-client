<template>
  <div>
    <component v-for="(item, index) in data" :key="index" :is="typeComponent[item.type]" />
  </div>
</template>

<script>
import Chart1 from "@/views/target/components/Chart1";
import Chart2 from "@/views/target/components/Chart2";

export default {
  name: "Target",
  components: {
    Chart1,
    Chart2
  },
  data() {
    return {
      data: [{ type: 1 }, { type: 2 }],
      typeComponent: {
        1: Chart1,
        2: Chart2
      }
    };
  },
  methods: {}
};
</script>

<style scoped lang="scss"></style>
