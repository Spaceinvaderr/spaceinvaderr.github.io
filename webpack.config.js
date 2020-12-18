const path = require('path');

module.exports = {
    mode: 'development',
    entry: './gulpfile.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.bundle.js'
    },
    target: "webworker", // or 'node' or 'node-webkit'
    externals:{
        fs:    "commonjs fs",
        path:  "commonjs path"
    }
  };