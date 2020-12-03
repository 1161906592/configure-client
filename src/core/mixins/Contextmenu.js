export function Contextmenu() {}

Contextmenu.prototype = {
  constructor: Contextmenu,
  addContextmenu() {
    this.contextmenu = e => {
      e.event.preventDefault();
      this.root.oncontextmenu(this, e);
    };
    this.on("contextmenu", this.contextmenu);
  },
  offContextmenu() {
    this.off("contextmenu", this.contextmenu);
  }
};
