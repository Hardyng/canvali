import { fabric } from "fabric";
import PosterizeFilter from "./filters/PosterizeFilter";

if (fabric.isWebglSupported()) {
  fabric.textureSize = fabric.maxTextureSize;
}
const defaultOpts = {
  dropImages: true,
  height: 500,
  width: 500
};
const Canvali = fabric.util.createClass(fabric.Canvas, {
  initialize: function(el, opts) {
    if (typeof el === "string") {
      el = document.getElementById(el);
      if (!el) {
        el = document.querySelector(el);
      }
    }
    if (!el) {
      throw new Error("No element provided");
    }
    opts = Object.assign(defaultOpts, opts);
    this.callSuper("initialize", el, opts);
    if (opts.dropImages) {
      this.watchFileDrop();
    }
    this._img = null;
  },
  watchFileDrop: function() {
    this.wrapperEl.addEventListener(
      "dragover",
      e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        return false;
      },
      false
    );
    this.wrapperEl.addEventListener(
      "drop",
      e => {
        let url;
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.getData("URL")) {
          url = e.dataTransfer.getData("URL");
          fabric.Image.fromURL(
            url,
            oImg => {
              this.addImage(oImg);
            },
            { crossOrigin: "Anonymous" }
          );
        } else if (
          e.dataTransfer.files[0] &&
          e.dataTransfer.files[0].type.match(/image.*/)
        ) {
          const reader = new FileReader();

          reader.onload = e2 => {
            url = e2.target.result;
            fabric.Image.fromURL(
              url,
              oImg => {
                this.addImage(oImg);
              },
              { crossOrigin: "Anonymous" }
            );
          };

          reader.readAsDataURL(e.dataTransfer.files[0]); // start reading the file data.
        }
      },
      false
    );
  },
  addImage: function(oImg) {
    // let _scaleMultipl;
    // if (oImg.width < this._scene.width) {
    // }

    const scale = Math.max(
      this._scene.width / oImg.width,
      this._scene.height / oImg.height
    );
    console.log(
      scale,
      this._scene.width,
      oImg.width,
      this._scene.height,
      oImg.height
    );
    if (this._img) {
      this.remove(this._img);
    }
    this._img = oImg;
    oImg.set({
      hasRotatingPoint: false,
      lockScalingFlip: true,
      absolutePositioned: true,
      top: this._scene.top,
      left: this._scene.left,
      clipPath: this._scene,
      scaleY: scale,
      scaleX: scale
    });

    const onMovement = () => {
      oImg.setCoords();
      const top = oImg.getBoundingRect().top;
      const bottom = top + oImg.getBoundingRect().height;
      const left = oImg.getBoundingRect().left;
      const right = left + oImg.getBoundingRect().width;

      const topBound = this._scene.top;
      const bottomBound = topBound + this._scene.height;
      const leftBound = this._scene.left;
      const rightBound = leftBound + this._scene.width;
      console.log(top, topBound);
      oImg.set(
        "top",
        bottom < bottomBound
          ? bottomBound - oImg.getBoundingRect().height
          : top > topBound
          ? topBound
          : top
      );
      oImg.set(
        "left",
        right < rightBound
          ? rightBound - oImg.getBoundingRect().width
          : left > leftBound
          ? leftBound
          : left
      );
    };
    const onScaling = e => {
      oImg.setCoords();
      if (
        oImg.getBoundingRect().height < this._scene.height ||
        oImg.getBoundingRect().width < this._scene.width
      ) {
        oImg.set("scaleY", e.transform.original.scaleY);
        oImg.set("scaleX", e.transform.original.scaleX);
      }
      oImg.setCoords();
      onMovement();
    };
    oImg.on({
      moving: onMovement,
      scaling: onScaling
    });
    this.add(oImg);
  },
  setScene: function(scene) {
    this.add(canvaliScene);
    this._scene = scene;
    this._scene.updatePosition();
  },
  toDataURL(
    opts = {
      format: "png",
      top: this._scene.top,
      left: this._scene.left,
      width: this._scene.width,
      height: this._scene.height,
      multiplier: 3
    }
  ) {
    return this.callSuper("toDataURL", opts);
  },
  download: function() {
    const _base64 = this.toDataURL();

    function dataURIToBlob(dataURI, callback) {
      const binStr = atob(dataURI.split(",")[1]);
      const len = binStr.length;
      const arr = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      callback(new Blob([arr], { type: "image/png" }, "abc"));
    }

    function saveFile(blob) {
      if (blob !== null && navigator.msSaveBlob) {
        return navigator.msSaveBlob(blob);
      }
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "abc";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }

    dataURIToBlob(_base64, saveFile);
  },
  filter(type, value = null, { setNew = true } = {}) {
    console.log(this._img);
    if (!this._img) {
      return;
    }
    const filters = {
      grayscale: {
        Factory: fabric.Image.filters.Grayscale,
        params: []
      },
      noise: {
        Factory: fabric.Image.filters.Noise,
        params: [
          {
            defaultValue: 50,
            paramName: "noise"
          }
        ]
      },
      sepia: {
        Factory: fabric.Image.filters.Sepia,
        params: []
      },
      blur: {
        Factory: fabric.Image.filters.Blur,
        params: [
          {
            min: 0,
            max: 1,
            default: 0.1,
            paramName: "blur"
          }
        ]
      },
      convolute: {
        Factory: fabric.Image.filters.Convolute,
        params: [
          {
            paramName: "matrix",
            default: [1, 1, 1, 1, 0.7, -1, -1, -1, -1]
          }
        ]
      },
      contrast: {
        Factory: fabric.Image.filters.Contrast,
        params: [
          {
            paramName: "contrast",
            min: -1,
            max: 1,
            default: 0.2
          }
        ]
      },
      posterize: {
        Factory: PosterizeFilter,
        params: [
          {
            min: 0,
            max: 8,
            paramName: "posterize",
            default: 8
          }
        ]
      }
    };
    if (filters[type]) {
      const newFilter = new filters[type].Factory(
        filters[type].params.reduce(
          (params, curr) => ({
            ...params,
            [curr.paramName]: value ? value : curr.defaultValue
          }),
          {}
        )
      );
      if (setNew) {
        this._img.filters = [newFilter];
      } else {
        this._img.filters.push(newFilter);
      }
    }
    this._img.applyFilters();
    this.renderAll();
  }
});

export default Canvali;
