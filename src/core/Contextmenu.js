export function Contextmenu() {
  if (!this.root.oncontextmenu) return;
  this.contextmenu = e => {
    e.event.preventDefault();
    this.root.oncontextmenu(this, e);
  };
  this.on("contextmenu", this.contextmenu);
  this.offContextmenu = () => {
    this.off("contextmenu", this.contextmenu);
  };
}
