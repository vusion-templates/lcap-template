# lcap-template
> 低代码应用模板

## 项目结构
```
|-- root
  |-- packages
      |-- core // 通用基础包
      |-- pc // pc端业务包
      |-- h5 // h5端业务包
```

## 环境依赖
- nodejs 18
- pnpm 8

## 安装依赖
> 项目根目录下
```
pnpm install
```

## 本地发布静态资源
> 根目录下
```
pnpm build

pnpm deploy:dev
```

## 修改版本号方式
> 根目录下
```
pnpm change:version --version 1.0.0
```

## 分支管理

- master: 主分支，最新代码
- develop: 开发分支，开发代码
- release/v: 发布分支，版本发布代码

工作流

新功能开发
- 从develop拉取新分支
- 开发新功能
- 提交代码到新分支
- 提交PR到develop
- 合并代码到develop


版本发布
- 从develop拉取release/v
- 修改版本号
- 发布版本
- 打tag
- 合并代码到master
- 合并代码到develop


hotfix
- 从master按tag拉取新分支
- 提交代码到新分支
- 提交PR到master
- 打新tag
- 合并代码到master
- 合并代码到develop
