---
title: '如何将第三方API接入OpenClaw？'
author: 'Elon Woo'
description: "OpenClaw是一个开源的AI工具平台，支持接入各种第三方API来扩展其功能。本文将介绍如何将第三方API接入OpenClaw，特别是在没有官方API密钥的情况下。"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2026-02-10
tags: ["ai", "tools"]
likeCount: 11
shareCount: 4
docked: false
---

Openclaw的安装不难，可以参考[参考官网](https://openclaw.ai/)的安装命令，安装过程中会有一些配置步骤，可以按照安装提示和其它教程。网络上的教程往往是接入官方api的，接入第三方api的教程较少，拥有官方api密钥可跳过，本文仅针对没有官方api密钥的情况进行说明。

## 接入第三方API

### 自定义配置文件

在[openclaw配置生成器](https://coclaw.com/openclaw-config-generator/)中配置生成配置文件并下载。

- Core
  - Secrets选择Inline in JSON;
- AI Providers
  - Mode选择Custom baseUrl;
  - AI Providers无需更改，按照已有模型的选择api。
  - 填写好API的baseUrl和key，生成配置文件并复制其内容。

### 替换配置文件

安装openclaw后，系统文件夹中会出现`~/.openclaw/`目录，里面有一个`openclaw.json`文件，这个文件就是openclaw的配置文件，里面包含了模型的配置信息。

将原来的openclaw.json文件改成为openclaw.json.bak，备份后将复制的配置信息粘贴进去。

```angular2html
cd ~/.openclaw/
cp openclaw.json openclaw.json.bak
dG
```

### 重新安装openclaw

输入`openclaw onboard --install-daemon`，重新进入安装配置过程。在配置大模型的步骤中会发现默认模型已经改成了自定义的模型。


## 其它参考

- [接入飞书教程](https://www.cnblogs.com/catchadmin/p/19592309)


## 卸载方法

```
openclaw uninstall  // 没有卸载CLI
npm rm -g openclaw  // 卸载CLI
```

检查`root\`目录和`\usr\lib\node_modules`下是否还有`openclaw`相关文件夹，删除。
