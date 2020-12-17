<script>
export default {
  name: "TreeChart",
  props: {
    data: { type: Object },
    renderContent: { type: Function },
    direction: { type: String, default: "left" },
    horizontalSpace: { type: Array, default: () => [20, 20] },
    verticalSpace: { type: Array, default: () => [10, 20] },
    lineOffset: { type: Number, default: 12 },
    lineColor: { type: String, default: "#000" }
  },

  render(h) {
    const renderSlot = this.$scopedSlots.default;
    const renderTree = (data, isFirst, isLast) => {
      const len = data.children.length;
      const nodeChildren = [
        h(
          "div",
          {
            class: "content"
          },
          [
            h("div", {
              style: {
                position: "absolute",
                height: "1px",
                width: `${this.horizontalSpace[0]}px`,
                left: 0,
                top: isFirst ? `${this.lineOffset}px` : `${this.lineOffset + this.verticalSpace[1]}px`,
                background: this.lineColor
              }
            }),
            h(
              "div",
              {
                class: "inner",
                style: {
                  padding: "8px 20px",
                  border: "1px solid #eaeaea"
                }
              },
              this.renderContent ? this.renderContent(data) : renderSlot ? renderSlot(data) : null
            )
          ]
        ),
        len
          ? h(
              "div",
              {
                class: "children",
                style: {
                  position: "relative",
                  padding: `0 ${this.horizontalSpace[0]}px 0 ${this.horizontalSpace[1]}px`
                }
              },
              [
                h("div", {
                  style: {
                    position: "absolute",
                    height: "1px",
                    width: `${this.horizontalSpace[1]}px`,
                    left: "0",
                    top: `${this.lineOffset}px`,
                    background: this.lineColor
                  }
                }),
                ...data.children.map((item, index) => renderTree(item, index === 0, index === len - 1))
              ]
            )
          : null
      ];

      if (this.direction === "right" || this.direction === "bottom") {
        nodeChildren.reverse();
      }

      return h(
        "div",
        {
          class: "node",
          style: {
            display: "flex",
            position: "relative",
            padding: `${this.verticalSpace[1]}px ${this.horizontalSpace[1]}px ${this.verticalSpace[0]}px ${this.horizontalSpace[0]}px`,
            paddingTop: isFirst ? "0px" : undefined,
            paddingBottom: isLast ? "0px" : undefined
          }
        },
        [
          !isFirst &&
            h("div", {
              style: {
                position: "absolute",
                width: "1px",
                height: `${this.lineOffset + this.verticalSpace[1]}px`,
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
                width: "1px",
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
        class: this.direction
      },
      [renderTree(this.data)]
    );
  }
};
</script>
