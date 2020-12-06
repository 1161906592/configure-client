<template>
  <div>
    <div class="header">
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'dom')">dom矩形</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('rect', 'zr')">canvas矩形</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'dom')">dom圆</el-button>
      <el-button type="primary" size="small" draggable="true" @dragstart.native="handleDragstart('circle', 'zr')">canvas圆</el-button>
      <el-button type="primary" size="small" @click="handleStartDrawLine">画线</el-button>
      <el-button type="primary" size="small" @click="handleStartFocus">选择</el-button>
      <el-button type="primary" size="small" @click="handleClearHandler">配置</el-button>
      <el-button type="primary" size="small" @click="handleSave">保存</el-button>
    </div>
    <div class="bottom">
      <div class="root" ref="root" @dragover.prevent></div>
      <div class="contextmenu" :style="style" v-show="style" @click.stop>
        <div v-for="(item, index) in contextmenu" :key="index" @click="item.handler">{{ item.name }}</div>
      </div>
    </div>
    <el-drawer title="配置元素" :visible.sync="panelVisible" size="400px">
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
      <div class="footer">
        <el-button size="small" @click="panelVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleSure">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Root, createElement, structRender, rootStateEnum, configurableMap, fieldTypeEnum, makeConfiguration } from "../core";
import { eachObj, makeMap } from "../core/helpers";

export default {
  name: "Home",
  data() {
    return {
      contextmenu: [],
      style: null,
      data: Object.freeze(JSON.parse(localStorage.getItem("data")) || []),
      panelVisible: false,
      form: {
        items: [],
        dataList: []
      },
      fieldTypeEnum: Object.freeze(fieldTypeEnum)
    };
  },
  mounted() {
    this.root = new Root({
      el: this.$refs.root,
      state: rootStateEnum.focus
    });
    this.root.el.addEventListener("drop", this.handleDrop);
    document.addEventListener("click", () => {
      this.style = null;
    });

    this.root.on("click", item => {
      if (this.root.state !== rootStateEnum.off) return;
      this.panelVisible = true;
      this.curElement = item;
      const dataList = [];
      eachObj(item.data, (value, key) => {
        dataList.push({ key, value });
      });
      if (!dataList.length) {
        dataList.push({});
      }
      this.form = {
        dataList: dataList,
        items: configurableMap[item.type][item.platform].items.map(d => {
          return {
            ...d,
            value: item[d.prop]
          };
        })
      };
    });

    this.root.on("contextmenu", this.handleContextmenu);

    structRender(this.root, this.data);
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
        y: e.offsetY
      });
      this.root.add(element);
    },
    handleStartDrawLine() {
      this.root.startDrawLine();
    },
    handleStartFocus() {
      this.root.startFocus();
    },
    handleClearHandler() {
      this.root.clearHandler();
    },
    handleSave() {
      const data = this.root.exportStruct();
      console.log(data);
      localStorage.setItem("data", JSON.stringify(data));
    },
    handleSure() {
      console.log(makeConfiguration(this.form.items));
      this.curElement.setConfiguration(makeConfiguration(this.form.items));
      this.curElement.data = makeMap(
        this.form.dataList.filter(d => d.key),
        (map, item) => {
          map[item.key] = item.value;
        }
      );
      // this.panelVisible = false;
    },
    handleContextmenu(item, e) {
      e.event.preventDefault();
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
          name: "添加子元素",
          handler: () => {
            const element = createElement({
              type: item.type,
              platform: item.platform,
              x: item.x + 20,
              y: item.y + 20,
              width: item.width,
              height: item.height
            });
            item.addChild(element);
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
      margin-bottom: 12px;
    }
  }
  .remove-btn {
    margin-bottom: 12px;
    line-height: 28px;
  }
}
.footer {
  margin-top: 16px;
  text-align: center;
}
</style>
