<template>
  <tree-chart :data="data">
    <template #default="data">
      {{ data.name }}
    </template>
  </tree-chart>
</template>
<script>
import TreeChart from "./components/TreeChart";
export default {
  name: "Index",
  components: { TreeChart },
  data() {
    return {
      data: Object.freeze({
        name: "1",
        children: [
          {
            name: "2",
            children: [
              {
                name: "2",
                children: []
              },
              {
                name: "333333333333",
                children: []
              }
            ]
          },
          {
            name: "3",
            children: [
              {
                name: "13333333333333",
                children: [
                  {
                    name: "2",
                    children: []
                  },
                  {
                    name: "3",
                    children: []
                  }
                ]
              },
              {
                name: "1",
                children: [
                  {
                    name: "2",
                    children: []
                  },
                  {
                    name: "3",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            name: "1",
            children: [
              {
                name: "2",
                children: []
              },
              {
                name: "3",
                children: []
              }
            ]
          }
        ]
      })
    };
  },
  methods: {
    renderContent(data) {
      return data.name;
    }
  }
};
</script>
