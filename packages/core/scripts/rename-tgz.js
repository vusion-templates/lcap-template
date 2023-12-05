const vusion = require('vusion-api');
const upload = require('lcap/lib/upload');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const pkg = require('../package.json');

const root = path.resolve(__dirname, '../');

const tgz = `lcap-core-template-${pkg.version}.tgz`;
const tgzPath = path.resolve(root, tgz);

// tgz 是否存在
if (!fs.existsSync(tgzPath)) {
  vusion.cli.error(`${tgzPath} not found`);
  process.exit(1);
}

const source = "zip.tgz";
const sourcePath = path.resolve(root, source);

// zip.tgz 是否存在
if (fs.existsSync(sourcePath)) {
  fs.unlinkSync(sourcePath);
}

// 复制tgz到zip.tgz
fs.copyFileSync(tgzPath, sourcePath);

if (!fs.existsSync(sourcePath)) {
  console.error(`Cannot find source: ${sourcePath}`);
  process.exit(1);
}

// const prefix = `packages/${pkg.name}@${pkg.version}`;
// let formFiles = [source];

// if (!formFiles.length) {
//   cli.warn("No files found!");
//   process.exit(0);
// }

// formFiles = formFiles.map((filePath) => {
//   let relativePath = path
//     .relative(root, filePath)
//     .replace(/^public[\\/]/, "")
//     .replace(/\\/g, "/");
//   relativePath = path.posix.join(prefix, relativePath);
//   return { name: relativePath, path: filePath };
// });

// upload(formFiles, {
//   platform: argv.platform,
// }).then(() => {
//   vusion.cli.done(`上传成功 ${tgz}`);
// }).catch(() => {
//   vusion.cli.error(`上传失败 ${tgz}`);
// }).finally(() => {
//   // 删除zip.tgz
//   fs.unlinkSync("zip.tgz");
// });

// http://minio-api.codewave-dev.163yun.com/lowcode-static/packages/@lcap/template-core@3.5.0/zip.tgz