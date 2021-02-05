<script>
export default {
  name: "TreeChart",
  props: {
    data: { type: Object },
    renderContent: { type: Function },
    direction: { type: String, default: "left" },
    horizontalSpace: { type: Array, default: () => [40, 30] },
    verticalSpace: { type: Array, default: () => [0, 40] },
    lineOffset: { type: Number, default: 12 },
    lineWidth: { type: Number, default: 2 },
    lineColor: { type: String, default: "#000" }
  },

  render(h) {
    const renderSlot = this.$scopedSlots.default;
    const renderTree = (data, isFirst, isLast) => {
      const nodeChildren = [
        h(
          "div",
          {
            class: "content",
            style: {
              position: "relative"
            }
          },
          [
            h("div", {
              style: {
                position: "absolute",
                height: `${this.lineWidth}px`,
                width: `${this.horizontalSpace[0]}px`,
                left: `-${this.horizontalSpace[0]}px`,
                top: `${isFirst ? this.lineOffset : this.lineOffset + this.verticalSpace[0]}px`,
                background: this.lineColor
              }
            }),
            h(
              "div",
              {
                class: "inner",
                style: {
                  // padding: "8px 20px",
                  // border: "2px solid #000"
                }
              },
              this.renderContent ? this.renderContent(data) : renderSlot ? renderSlot(data) : null
            ),
            data.children.length &&
              h("i", {
                class: data.isCollapsed ? "el-icon-circle-plus" : "el-icon-remove",
                style: {
                  position: "absolute",
                  right: "-15px",
                  top: `${(isFirst ? this.lineOffset : this.lineOffset + this.verticalSpace[0]) + 1}px`,
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  zIndex: 99,
                  color: "#365BE4",
                  fontSize: "16px"
                },
                on: {
                  click: () => {
                    this.$set(data, "isCollapsed", !data.isCollapsed);
                  }
                }
              })
          ].filter(Boolean)
        ),
        data.children.length && !data.isCollapsed
          ? h(
              "div",
              {
                class: "children",
                style: {
                  position: "relative",
                  padding: `0 0 0 ${this.horizontalSpace[1]}px`
                }
              },
              [
                h("div", {
                  style: {
                    position: "absolute",
                    height: `${this.lineWidth}px`,
                    width: `${this.horizontalSpace[1]}px`,
                    left: "16px",
                    top: `${this.lineOffset}px`,
                    background: this.lineColor
                  }
                }),
                ...data.children.map((item, index) => renderTree(item, index === 0, index === data.children.length - 1))
              ]
            )
          : null
      ];

      return h(
        "div",
        {
          class: "node",
          style: {
            display: "flex",
            position: "relative",
            padding: `${this.verticalSpace[0]}px 0px ${this.verticalSpace[1]}px ${this.horizontalSpace[0]}px`,
            paddingTop: isFirst ? 0 : `${this.verticalSpace[0]}px`,
            paddingBottom: isLast ? 0 : `${this.verticalSpace[1]}px`
          }
        },
        [
          !isFirst &&
            h("div", {
              style: {
                position: "absolute",
                width: `${this.lineWidth}px`,
                height: `${this.lineOffset + this.verticalSpace[0]}px`,
                left: 0,
                top: 0,
                background: this.lineColor
              }
            }),
          ...nodeChildren,
          !isLast &&
            h("div", {
              style: {
                position: "absolute",
                width: `${this.lineWidth}px`,
                height: `calc(100% - ${this.lineOffset}px)`,
                left: 0,
                top: `${this.lineOffset}px`,
                background: this.lineColor
              }
            })
        ].filter(Boolean)
      );
    };
    return h(
      "div",
      {
        class: "root"
      },
      [renderTree(this.data, true, true)]
    );
  }
};
</script>

<style lang="scss" scoped>
.root {
  > .node {
    padding: 0 !important;
    > .content > div:first-child {
      display: none;
    }
  }
}
</style>
