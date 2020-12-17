<script>
export default {
  name: "TreeChart",
  props: {
    data: { type: Object },
    renderContent: { type: Function },
    direction: { type: String, default: "left" }
    // space
  },

  render(h) {
    const renderSlot = this.$scopedSlots.default;
    const renderTree = data => {
      const nodeChildren = [
        h(
          "div",
          {
            class: "inner"
          },
          this.renderContent ? this.renderContent(data) : renderSlot ? renderSlot(data) : null
        ),
        data.children.length
          ? h(
              "div",
              {
                class: "children"
              },
              data.children.map(item => renderTree(item))
            )
          : null
      ];

      if (this.direction === "right" || this.direction === "bottom") {
        nodeChildren.reverse();
      }

      return h(
        "div",
        {
          class: "node"
        },
        nodeChildren
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

<style scoped lang="scss">
.node {
  position: relative;
  display: flex;
  align-items: center;
  &:before,
  &:after {
    content: "";
    position: absolute;
  }
  &:first-child:before,
  &:last-child:after {
    content: none;
  }
}
.inner {
  padding: 8px 20px;
  border: 1px solid #eaeaea;
  &:before {
    content: "";
    position: absolute;
  }
}
.children {
  position: relative;
  &:before {
    content: "";
    position: absolute;
  }
}
.root {
  &:before {
    content: none;
  }
}

.left,
.right {
  .node {
    padding: 4px 20px;
    &:before,
    &:after {
      height: 50%;
      width: 19px;
    }
    &:before {
      top: 0;
    }
    &:after {
      top: 50%;
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }
  }
  .inner {
    &:before {
      height: 1px;
      width: 19px;
      top: 50%;
      border-top: 1px solid #eaeaea;
    }
  }
  .children {
    padding: 0 20px;
    &:before {
      height: 1px;
      width: 20px;
      top: 50%;
      border-top: 1px solid #eaeaea;
    }
  }
}

.left {
  .node {
    &:before,
    &:after {
      left: 0;
      border-left: 1px solid #eaeaea;
    }
  }
  .inner,
  .children {
    &:before {
      left: 0;
    }
  }
}

.right {
  .node {
    justify-content: flex-end;

    &:after,
    &:before {
      right: 0;
      border-right: 1px solid #eaeaea;
    }
  }
  .inner,
  .children {
    &:before {
      right: 0;
    }
  }
}

.top,
.bottom {
  .node {
    flex-direction: column;
    padding: 20px 4px;
    &:before,
    &:after {
      width: 50%;
      height: 19px;
    }
    &:before {
      left: 0;
    }
    &:after {
      left: 50%;
    }
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
  .inner {
    &:before {
      width: 1px;
      height: 19px;
      left: 50%;
      border-left: 1px solid #eaeaea;
    }
  }
  .children {
    display: flex;
    padding: 20px 0;
    &:before {
      width: 1px;
      height: 20px;
      left: 50%;
      border-left: 1px solid #eaeaea;
    }
  }
}

.top {
  .node {
    &:before,
    &:after {
      top: 0;
      border-top: 1px solid #eaeaea;
    }
  }
  .inner,
  .children {
    &:before {
      top: 0;
    }
  }
}

.bottom {
  .node {
    justify-content: flex-end;

    &:after,
    &:before {
      bottom: 0;
      border-bottom: 1px solid #eaeaea;
    }
  }
  .inner,
  .children {
    &:before {
      bottom: 0;
    }
  }
}
</style>
