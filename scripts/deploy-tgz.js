const upload = require('lcap/lib/upload');
const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {*} options
 * @param {string} options.target
 * @param {string} options.root
 * @param {string} options.name
 * @param {string} options.version
 * @param {string} options.platform
 * @returns {Promise<void>}
 * http://minio-api.codewave-dev.163yun.com/lowcode-static/packages/@lcap/template-core@3.5.0/zip.tgz
 */
function deployTgz(options = {}) {
  const { root, name, version, platform, username, password } = options;

  const target = name.replace("@", "").replace("/", "-") + "-" + version + ".tgz";
  const targetPath = path.resolve(root, target);
  // tgz 是否存在
  if (!fs.existsSync(targetPath)) {
    console.error(`${targetPath} not found`);
    process.exit(1);
  }

  const source = "zip.tgz";
  const sourcePath = path.resolve(root, source);

  // zip.tgz 是否存在
  if (fs.existsSync(sourcePath)) {
    fs.unlinkSync(sourcePath);
  }

  // 复制tgz到zip.tgz
  fs.copyFileSync(targetPath, sourcePath);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Cannot find source: ${sourcePath}`);
    process.exit(1);
  }

  // 开始上传流程
  const prefix = `packages/${name}@${version}`;
  let formFiles = [source];

  if (!formFiles.length) {
    console.warn("No files found!");
    process.exit(0);
  }

  formFiles = formFiles.map((filePath) => {
    let relativePath = path
      .relative(root, filePath)
      .replace(/^public[\\/]/, "")
      .replace(/\\/g, "/");

    relativePath = path.posix.join(prefix, relativePath);

    return { 
      name: relativePath, 
      path: filePath 
    };
  });

  return upload(formFiles, {
    platform: platform,
    username: username,
    password: password,
  })
    .then(() => {
      console.log(`上传成功`);
    })
    .catch(() => {
      throw new Error("上传失败");
    })
    .finally(() => {
      fs.unlinkSync(sourcePath);
      fs.unlinkSync(targetPath);
    });
}

module.exports = deployTgz;