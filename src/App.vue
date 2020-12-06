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
  opacity: 0.3;
}

.el-form-item__label {
  font-size: 14px;
}
.el-dialog__title {
  font-size: 16px;
}
.el-dialog__body {
  padding: 0 20px;
}
</style>
