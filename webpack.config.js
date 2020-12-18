const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: './gulpfile.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.bundle.js'
    },
    node: {
        fs: "empty"
    }
  };