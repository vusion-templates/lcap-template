const fs = require('fs-extra');
const path = require('path');
const argv = require("minimist")(process.argv.slice(2));

const version = argv.version || require("../package.json").version;

// 检查version是否有效
const versionReg = /[0-9]+\.[0-9]+\.[0-9]+/
if (!versionReg.test(version)) {
  throw new Error('version不符合标准格式');
}

// 修改根目录下的package.json
const rootPkgPath = path.join(__dirname, "../package.json");
const rootPkg = require(rootPkgPath);
rootPkg.version = version;
fs.writeJSONSync(rootPkgPath, rootPkg, {
  spaces: 2,
  EOL: "\n",
});

// 遍历packages下的一级目录
const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);
packages.forEach((package) => {
  if (fs.statSync(path.join(packagesDir, package)).isDirectory()) {
    const pkgPath = path.resolve(packagesDir, package, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = require(pkgPath);
      pkg.version = version;
      // 使用LF换行符
      fs.writeJSONSync(pkgPath, pkg, {
        spaces: 2,
        EOL: "\n",
      });
    }
  }
});
