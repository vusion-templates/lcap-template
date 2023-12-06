const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cwd = process.cwd();
const coreDir = path.resolve(__dirname, '../packages/core');
const h5Dir = path.resolve(__dirname, '../packages/h5');
const pcDir = path.resolve(__dirname, '../packages/pc');

const version = argv.version || require('../lerna.json').version;

// 创建一个临时目录
const tempDir = path.resolve(cwd, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
} else {
    execSync(`rm -rf ${tempDir}`);
    fs.mkdirSync(tempDir);
}

// 复制h5的public里的内容到临时目录下的mobile-template@version
const mobileTemplateDir = path.resolve(tempDir, `mobile-template@${version}`);
fs.mkdirSync(mobileTemplateDir);
execSync(`cp -r ${h5Dir}/public/* ${mobileTemplateDir}`);
execSync(`cp ${h5Dir}/zip.tgz ${mobileTemplateDir}`);

// 复制pc的public里的内容到临时目录下的pc-template@version
const pcTemplateDir = path.resolve(tempDir, `pc-template@${version}`);
fs.mkdirSync(pcTemplateDir);
execSync(`cp -r ${pcDir}/public/* ${pcTemplateDir}`);
execSync(`cp ${pcDir}/zip.tgz ${pcTemplateDir}`);

// 复制core的zip.tgz文件到临时目录下的core-template@version
const coreTemplateDir = path.resolve(tempDir, `core-template@${version}`);
fs.mkdirSync(coreTemplateDir);
execSync(`cp ${coreDir}/zip.tgz ${coreTemplateDir}`);
