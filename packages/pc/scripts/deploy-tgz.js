const upload = require('lcap/lib/upload');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('../package.json');
const root = path.resolve(__dirname, '../');
const version = argv.version || pkg.version;

// 重命名zip.tgz
require('./rename-tgz');

const source = "zip.tgz";
// 开始上传流程
const prefix = `packages/${pkg.name}@${version}`;
let formFiles = [source];

if (!formFiles.length) {
  cli.warn("No files found!");
  process.exit(0);
}

formFiles = formFiles.map((filePath) => {
  let relativePath = path
    .relative(root, filePath)
    .replace(/^public[\\/]/, "")
    .replace(/\\/g, "/");

  relativePath = path.posix.join(prefix, relativePath);

  return { name: relativePath, path: filePath };
});

upload(formFiles, {
  platform: argv.platform,
}).then(() => {
  console.log(`上传成功`);
}).catch(() => {
  console.error(`上传失败`);
})

// http://minio-api.codewave-dev.163yun.com/lowcode-static/packages/@lcap/template-core@3.5.0/zip.tgz
