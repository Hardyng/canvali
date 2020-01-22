import { fabric } from "fabric";

const defaultOpts = {
  absolutePositioned: true,
  fill: "#fff",
  left: 0,
  right: null,
  top: 0,
  bottom: null,
  width: 300,
  height: 150,
  alignX: "center",
  alignY: "center",
  strokeWidth: 0,
  selectable: false,
  selection: false,
  shadow: {
    color: "rgba(0,0,0,0.3)",
    blur: 20,
    offsetX: 0,
    offsetY: 0
  },
  rx: 10,
  ry: 10
};

const CanvaliScene = fabric.util.createClass(fabric.Rect, {
  initialize: function(opts = {}) {
    opts = Object.assign(defaultOpts, opts);
    this.opts = opts;
    this.callSuper("initialize", opts);
  },
  updatePosition() {
    switch (this.opts.alignX) {
      case "start":
        this.set("left", 0);
        break;
      case "end":
        this.set("left", this.canvas.width - this.width);
        break;
      case "center":
        this.set("left", this.canvas.width / 2 - this.width / 2);
        break;
      default:
        break;
    }
    switch (this.opts.alignY) {
      case "top":
        this.set("top", 0);
        break;
      case "bottom":
        this.set("top", this.canvas.height - this.height);
        break;
      case "center":
        this.set("top", this.canvas.height / 2 - this.height / 2);
        break;
      default:
        break;
    }
  }
});

export default CanvaliScene;
