<template>
  <div>
    <div class="header">
      <!--      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'dom')">DOM矩形</el-button>-->
      <!--      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'zr')">CANVAS矩形</el-button>-->
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'svg')">矩形</el-button>
      <!--      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'dom')">DOM圆</el-button>-->
      <!--      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'zr')">CANVAS圆</el-button>-->
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'svg')">圆</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('text', 'svg')">文字</el-button>
      <el-button type="primary" size="small" @click="handleStartDrawPolyLine">折线</el-button>
      <el-button type="primary" size="small" @click="handleStartDrawLine">直线</el-button>
      <el-button type="primary" size="small" @click="handleStartFocus">选择</el-button>
      <el-button type="primary" size="small" @click="isSelectPath = false">退出轨迹绑定</el-button>
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
    </div>
    <div class="bottom">
      <div class="root" ref="root" @dragover.prevent></div>
      <div class="contextmenu" :style="style" v-show="style" @click.stop>
        <div v-for="(item, index) in contextmenu" :key="'a' + index" @click="item.handler">{{ item.name }}</div>
        <div v-for="(item, index) in subTypeOptions" :key="'b' + index" @click="handleSureSub(item)">{{ item.label }}</div>
      </div>
    </div>
    <el-dialog title="配置元素" :visible.sync="panelVisible" width="400px" :close-on-click-modal="false">
      <el-form size="mini">
        <el-form-item v-for="item in form.items" :key="item.prop" :label="item.label">
          <el-input v-model="item.value" v-if="item.type === fieldTypeEnum.text" />
          <el-input v-model="item.value" v-else-if="item.type === fieldTypeEnum.number" type="number" />
          <el-select v-model="item.value" v-else-if="item.type === fieldTypeEnum.select" style="width: 100%;">
            <el-option v-for="(item, index) in item.options" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <div class="sub-title">
          <span>自定义数据</span>
          <el-button class="icon-btn" type="primary" size="mini" @click="form.dataList.push({})" icon="el-icon-plus"></el-button>
        </div>
        <div v-for="(item, index) in form.dataList" :key="index" class="data-item">
          <el-form-item label="key">
            <el-input v-model="item.key" />
          </el-form-item>
          <el-form-item label="value">
            <el-input v-model="item.value" />
          </el-form-item>
          <div class="remove-btn">
            <el-button class="icon-btn" type="primary" size="mini" @click="form.dataList.splice(index, 1)" icon="el-icon-minus"></el-button>
          </div>
        </div>
      </el-form>
      <template slot="footer">
        <el-button size="mini" @click="panelVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSure">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="添加子元素" :visible.sync="subVisible" width="240px" :close-on-click-modal="false">
      <el-form size="mini">
        <el-form-item label="子元素类型">
          <el-select v-model="subIndex" style="width: 100%;">
            <el-option v-for="(item, index) in subTypeOptions" :key="index" :label="item.label" :value="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="mini" @click="subVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSureSub">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Root, createElement, structRender, configurableMap, fieldTypeEnum, makeConfiguration, typeEnum, platformEnum } from "../core";
import { eachObj, makeMap } from "../core/helpers";
import { Element } from "@/core/Element";

export default {
  name: "Home",
  data() {
    return {
      contextmenu: [],
      style: null,
      data: Object.freeze(JSON.parse(localStorage.getItem("data"))),
      panelVisible: false,
      form: {
        items: [],
        dataList: []
      },
      fieldTypeEnum: Object.freeze(fieldTypeEnum),
      subVisible: false,
      subTypeOptions: [
        { label: "矩形", type: typeEnum.rect, platform: platformEnum.svg, isDialog: false },
        { label: "弹窗", type: typeEnum.rect, platform: platformEnum.svg, isDialog: true },
        { label: "圆", type: typeEnum.circle, platform: platformEnum.svg },
        { label: "文字", type: typeEnum.text, platform: platformEnum.svg }
      ],
      subIndex: 0
    };
  },
  mounted() {
    this.root = new Root({
      el: this.$refs.root
    });
    this.root.startFocus();
    this.root.el.addEventListener("drop", this.handleDrop);
    document.addEventListener("click", () => {
      this.style = null;
    });
    this.root.on("click", item => {
      // if (this.root.state !== rootStateEnum.off) return;
      if (this.isSelectPath && item.isLinkLine) {
        this.$confirm("确认绑定该轨迹?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(() => {
          this.curElement.extData.tranformPathId = item.id;
          this.isSelectPath = false;
        });
      }
    });

    this.root.on("contextmenu", this.handleContextmenu);
    this.data &&
      structRender(this.data, {
        root: this.root
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
        x: e.offsetX,
        y: e.offsetY,
        onCreated() {
          console.log(this);
        },
        onMounted() {
          console.log(this);
        },
        onUnmount() {
          console.log(this);
        }
      });
      console.log(element, element instanceof Element);
      element.mount(this.root);
    },
    handleStartDrawPolyLine() {
      this.root.startDrawPolyLine();
    },
    handleStartDrawLine() {
      this.root.startDrawLine();
    },
    handleStartFocus() {
      this.root.startFocus();
    },
    handleSave() {
      const data = this.root.export();
      console.log(data);
      localStorage.setItem("data", JSON.stringify(data));
    },
    handleSure() {
      console.log(this.curElement, makeConfiguration(this.form.items));
      this.curElement.attr(makeConfiguration(this.form.items));
      this.curElement.data = makeMap(
        this.form.dataList.filter(d => d.key),
        (map, item) => {
          map[item.key] = item.value;
        }
      );
      this.panelVisible = false;
    },
    handleContextmenu(item, e) {
      e.event.preventDefault();
      if (this.root.curResizeElement !== item) return;
      this.style = {
        left: e.offsetX + "px",
        top: e.offsetY + "px"
      };
      this.curElement = item;
      this.curEvent = e;
      this.contextmenu = [
        {
          name: "删除",
          handler: () => {
            item.unmount();
            this.style = null;
          }
        },
        {
          name: "配置",
          handler: () => {
            this.panelVisible = true;
            const dataList = [];
            eachObj(item.data, (value, key) => {
              dataList.push({ key, value });
            });

            this.form = {
              dataList: dataList,
              items: configurableMap[item.type][item.platform].items.map(d => {
                return {
                  ...d,
                  value: item[d.prop]
                };
              })
            };
            this.style = null;
          }
        },
        item.extData.tranformPathId
          ? {
              name: "解绑轨迹",
              handler: () => {
                delete item.extData.tranformPathId;
                this.style = null;
              }
            }
          : {
              name: "绑定轨迹",
              handler: () => {
                this.style = null;
                this.isSelectPath = true;
                // item.unmount();
              }
            }
      ];
    },
    handleSureSub(item) {
      const element = createElement({
        type: item.type,
        platform: item.platform,
        x: this.curEvent.offsetX + 20,
        y: this.curEvent.offsetY + 20,
        immediateMount: !item.isDialog
      });
      this.curElement.addChild(element);
      this.subVisible = false;
      this.style = null;
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  box-shadow: 0 2px 10px 0 rgba(82, 86, 108, 0.22);
  background: #fff;
  border-radius: 4px;
  z-index: 99;
}

.bottom {
  position: relative;
}

.root {
  height: 100vh;
  position: relative;
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
.sub-title {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  padding: 3px;
}
.data-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  ::v-deep {
    > .el-form-item {
      flex: 1;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .remove-btn {
    margin-bottom: 10px;
    line-height: 28px;
  }
}
.footer {
  margin-top: 16px;
  text-align: center;
}
</style>
