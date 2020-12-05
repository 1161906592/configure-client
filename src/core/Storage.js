function Storage() {
  this.elementList = [];
  this.elementMap = new Map();
}

Storage.prototype = {
  add(element) {
    this.elementList.push(element);
    this.elementMap.set(element.id, element);
  },

  remove(element) {
    const idx = this.elementList.findIndex(d => d === element);
    if (idx !== -1) {
      this.elementList.splice(idx, 1);
      this.elementMap.delete(element.id);
    }
  },

  getElementById(id) {
    return this.elementMap.get(id);
  },

  getElementList() {
    return this.elementList;
  }
};

export { Storage };
