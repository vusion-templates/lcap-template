const upload = require('lcap/lib/upload');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

function deploy(options = {}) {
  const { root, dest, name, version, platform, username, password } = options;
  const source = path.resolve(root, dest);

  if (!fs.statSync(source).isDirectory()) {
    console.error(`dest: '${dest}' is not a directory`);
    process.exit(1);
  }

  // 开始上传流程
  const prefix = `packages/${name}@${version}`;
  
  let formFiles = glob.globSync(`${source}/**`, {
    nodir: true,
  });

  if (!formFiles?.length) {
    console.warn("No files found!");
    process.exit(0);
  }

  formFiles = formFiles.map((filePath) => {
    let relativePath = path
      .relative(source, filePath)
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
}

module.exports = deploy;