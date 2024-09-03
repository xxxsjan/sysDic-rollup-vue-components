const glob = require('glob');

glob('*/index.js', {
  cwd: __dirname, // 指定当前目录
}, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(files); // 输出所有index.js文件的路径
});

