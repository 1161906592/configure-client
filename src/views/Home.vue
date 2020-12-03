<template>
  <div>
    <div class="header">
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'dom')">dom矩形</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'zr')">canvas矩形</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'dom')">dom圆</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'zr')">canvas圆</el-button>
      <el-button type="primary" size="small" @click="handleStartDrawLine">画线</el-button>
      <el-button type="primary" size="small" @click="handleStartRectMove">移动</el-button>
      <el-button type="primary" size="small" @click="handleStartRectResize">缩放</el-button>
      <el-button type="primary" size="small" @click="handleClearHandler">清除状态</el-button>
    </div>
    <div class="bottom">
      <div class="root" ref="root" @dragover.prevent></div>
      <div class="contextmenu" :style="style" v-show="style" @click.stop>
        <div v-for="(item, index) in contextmenu" :key="index" @click="item.handler">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Root, createElement } from "../core";

export default {
  name: "Home",
  data() {
    return {
      contextmenu: [],
      style: null
    };
  },
  mounted() {
    this.root = new Root({
      el: this.$refs.root,
      oncontextmenu: this.handleContextmenu
    });
    this.root.on("drop", this.handleDrop);
    document.addEventListener("click", () => {
      this.style = null;
    });
  },
  methods: {
    handleDragstart(type, platform) {
      this.type = type;
      this.platform = platform;
    },
    handleDrop(e) {
      let element = createElement({
        type: this.type,
        platform: this.platform,
        shape: {
          x: e.offsetX,
          y: e.offsetY
        }
      });
      this.root.add(element);
    },
    handleStartDrawLine() {
      this.root.startDrawLine();
    },
    handleStartRectMove() {
      this.root.startElementMove();
    },
    handleStartRectResize() {
      this.root.startRectResize();
    },
    handleClearHandler() {
      this.root.clearHandler();
    },
    handleContextmenu(item, e) {
      this.style = {
        left: e.offsetX + "px",
        top: e.offsetY + "px"
      };
      this.contextmenu = [
        {
          name: "删除",
          handler: () => {
            item.root.remove(item);
            this.style = null;
          }
        },
        {
          name: "设置背景",
          handler: () => {
            item.setImage("/1.png");
            this.style = null;
          }
        },
        {
          name: "添加子元素",
          handler: () => {
            const element = createElement({
              type: item.type,
              platform: item.platform,
              shape: {
                x: item.shape.x + 20,
                y: item.shape.y + 20,
                width: item.shape.width,
                height: item.shape.height
              }
            });
            item.addChild(element);
            this.root.add(element);
            this.style = null;
          }
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #999;
}

.bottom {
  position: relative;
}

.root {
  height: calc(100vh - 60px);
}

.contextmenu {
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(82, 86, 108, 0.22);
  border-radius: 4px;
  padding: 8px 0;

  div {
    padding: 0 16px;
    line-height: 28px;
    cursor: pointer;
    &:hover {
      color: #365be4;
    }
  }
}
</style>
