module.exports = {
  presets: [
    ["@babel/env"]
    // ["minify", {
    //   "keepFnName": true
    // }]
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties"],
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
};
