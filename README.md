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
- nodejs 16
- pnpm 8

## 安装依赖
> 项目根目录下
```
pnpm install
```

## 本地发布静态资源
> 根目录下
```
npm run build:designer

npm run deploy:dev
```

## 发版asset资源获取

https://github.com/vusion-templates/lcap-template/actions

下载后的文件夹结构
```
|-- lcap-template
  |-- core-template@1.0.0 // 通用基础包
  |-- mobile-template@1.0.0 // h5端业务包
  |-- pc-template@1.0.0 // pc端业务包
```

‼️将上述3个文件夹放到lcap-assets目录的 @lcap 目录下

## 修改版本号方式
> 根目录下
```
pnpm dlx lerna version
```
