<template>
  <div style="padding: 20px;">
    <tree-chart :data="data">
      <template #default="data">
        <el-button v-if="data.isRoot" size="small" type="primary">{{ data.name }}</el-button>
        <div class="node" v-else-if="data.columns && data.columns.length">
          <table>
            <thead>
              <tr>
                <th>{{ data.name }}({{ data.unit }})</th>
                <th v-for="(column, index) in data.columns" :key="index">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data.data" :key="index">
                <td>{{ item.targetName }}</td>
                <td v-for="(column, index) in data.columns" :key="index">{{ item[column.prop] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="name-node" v-else>{{ data.name }}</div>
      </template>
    </tree-chart>
  </div>
</template>
<script>
import TreeChart from "./components/TreeChart";
export default {
  name: "Index",
  components: { TreeChart },
  data() {
    return {
      data: {
        name: "炼钢工序",
        isRoot: true,
        children: [
          {
            name: "产量",
            unit: "元/吨",
            columns: [
              {
                label: "累计",
                prop: "total"
              },
              {
                label: "当日",
                prop: "reality"
              },
              {
                label: "计划",
                prop: "plan"
              }
            ],
            data: [
              {
                targetName: "一号炼钢",
                total: 100,
                reality: 80,
                plan: 70
              },
              {
                targetName: "二号炼钢",
                total: 100,
                reality: 80,
                plan: 70
              }
            ],
            children: [
              {
                name: "产量",
                unit: "元/吨",
                columns: [
                  {
                    label: "累计",
                    prop: "total"
                  },
                  {
                    label: "当日",
                    prop: "reality"
                  },
                  {
                    label: "计划",
                    prop: "plan"
                  }
                ],
                data: [
                  {
                    targetName: "一号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  },
                  {
                    targetName: "二号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  }
                ],
                children: []
              },
              {
                name: "产量",
                unit: "元/吨",
                columns: [
                  {
                    label: "累计",
                    prop: "total"
                  },
                  {
                    label: "当日",
                    prop: "reality"
                  },
                  {
                    label: "计划",
                    prop: "plan"
                  }
                ],
                data: [
                  {
                    targetName: "一号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  },
                  {
                    targetName: "二号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  }
                ],
                children: []
              }
            ]
          },
          {
            name: "产量",
            unit: "元/吨",
            children: [
              {
                name: "产量",
                unit: "元/吨",
                columns: [
                  {
                    label: "累计",
                    prop: "total"
                  },
                  {
                    label: "当日",
                    prop: "reality"
                  }
                ],
                data: [
                  {
                    targetName: "一号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  },
                  {
                    targetName: "二号炼钢",
                    total: 100,
                    reality: 80,
                    plan: 70
                  }
                ],
                children: []
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    renderContent(data) {
      return data.name;
    }
  }
};
</script>

<style scoped lang="scss">
.node {
  border-right: 1px solid #999;
  border-left: 4px solid #365be4;
}
table {
  border-collapse: collapse;
}
td,
th {
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  padding: 0 12px;
  height: 38px;
}
.name-node {
  background: #e9ebf0;
  border-radius: 4px;
  padding: 0 12px;
  line-height: 36px;
}
</style>
