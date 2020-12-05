<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none !important;
}
body {
  font-size: 14px;
}
.v-modal {
  opacity: 0;
}
.el-drawer__header {
  margin-bottom: 0;
}
.el-form-item__label {
  font-size: 14px;
}
.el-drawer__body {
  padding: 20px;
}
</style>
