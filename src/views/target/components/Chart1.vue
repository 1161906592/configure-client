<template>
  <div>Chart1</div>
</template>

<script>
/**
 * @Describe: Describe
 * @Author: liuyang
 * @Date: 2020-12-17 15:07
 */
export default {
  name: "Chart1",
  computed: {
    option() {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            label: {
              backgroundColor: "#6a7985"
            },
            lineStyle: {
              type: "dashed",
              color: "#000"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value",
            max: 240
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            label: {
              show: true,
              position: "right",
              formatter: "计划",
              color: "#F5222D"
            },
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: "#F5222D",
              type: "dotted",
              width: 1
            },
            areaStyle: {
              color: "#F5222D",
              opacity: 0.25
            },
            data: [
              110,
              150,
              160,
              190,
              100,
              100,
              {
                value: 100,
                itemStyle: {
                  opacity: 1
                }
              }
            ]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              show: true,
              position: "right",
              formatter: "顶值",
              color: "#39C235"
            },
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: "#39C235",
              type: "dotted",
              width: 1
            },
            areaStyle: {
              color: "#39C235",
              opacity: 0.25
            },
            data: [
              130,
              90,
              80,
              50,
              140,
              140,
              {
                value: 140,
                itemStyle: {
                  opacity: 1
                }
              }
            ]
          },
          {
            data: [{ value: 110 }, { value: 130 }, { value: 120 }, { value: 160 }, { value: 140 }, { value: 130 }, { value: 120 }],
            type: "line",
            lineStyle: {
              color: "#365BE4"
            },
            itemStyle: {
              opacity: 0
            }
          }
        ]
      };
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss"></style>
