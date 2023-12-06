const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');

const root = path.resolve(__dirname, '../');

const tgz = `lcap-mobile-template-${pkg.version}.tgz`;
const tgzPath = path.resolve(root, tgz);

// tgz 是否存在
if (!fs.existsSync(tgzPath)) {
  console.error(`${tgzPath} not found`);
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
