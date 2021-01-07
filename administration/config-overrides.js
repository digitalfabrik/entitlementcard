
module.exports = function override(config, env) {
  config.resolve.alias.fs = 'pdfkit/js/virtual-fs.js'
  config.module.rules.push(...[
    { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
    { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
    { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
    // { test: /src[/\\]assets/, loader: 'arraybuffer-loader'},
    { test: /\.afm$/, loader: 'raw-loader'}
  ])
  return config;
}
