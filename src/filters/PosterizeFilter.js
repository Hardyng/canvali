import { fabric } from "fabric";

const PosterizeFilter = fabric.util.createClass(
  fabric.Image.filters.BaseFilter,
  {
    type: "Posterize",
    posterize: 8.0,
    initialize(options) {
      if (options) {
        this.setOptions(options);
      }
    },
    getUniformLocations(gl, program) {
      return {
        uPosterize: gl.getUniformLocation(program, "uPosterize")
      };
    },
    sendUniformData(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.uPosterize, this.posterize);
    },
    fragmentSource: `
        precision highp float;
        uniform sampler2D uTexture;
        varying vec2 vTexCoord;
        uniform float gamma;
        uniform float uPosterize;
        uniform float numColors;
        
        void main() {
          vec4 color = texture2D(uTexture, vTexCoord);
          vec3 c = color.rgb;
          c = pow(c, vec3(0.6, 0.6, 0.6));
          c = c * uPosterize;
          c = floor(c);
          c = c / uPosterize;
          c = pow(c, vec3(1.0/0.6));
          gl_FragColor = vec4(c, 1.0);
        }
      `
  }
);

PosterizeFilter.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.Posterize = PosterizeFilter;
export default PosterizeFilter;
