const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/core/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.bundle.js'
    },
    node: {
        fs: "empty"
    }
  };