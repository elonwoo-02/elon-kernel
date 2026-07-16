---
title: "我是怎么vibe-coding的？"
pubDate: 2026-02-20
description: "vibe coding 是一种和大模型一起开发的方式，核心理念是：让 AI 聚焦于当下的任务，不要一下子塞给它一堆问题。每个需求，开启一轮新的对话。完成一个 Feature，Close 掉，开启下一轮对话。"
author: "Elon Woo"
tags: ["vibe coding", "AGI", "软件开发"]
likeCount: 0
shareCount: 0
docked: false
---

## 编写配置文件

基本上所有的 agent 都有自己的配置文件，codex 是 AGENTS.md，gemini 是 GEMINI.md，claude code 是 CLAUDE.md。配置文件分为全局级别和项目级别，codex 的全局级别通常放在 ~/.codex 目录，项目级别则在当前项目的根目录。

持续优化 AGENTS.md 也很关键，这里最简单的办法就是，把你在和大模型沟通过程中发现它犯的错，直接添加到 AGENTS.md 里去，避免下次再重复。

## prepare

下载pycharm, node.js, codexCLI。

在pycharm创建项目，并初始化git仓库。

## Planning process

首先使用`/plan`打开plan功能，根据需求输入提示词，比如：

你是一个高级全栈开发工程师，请你实现一个项目，兼具RSS订阅阅读器和Markdown文本编辑功能，在本地存储，使用git实现版本控制和三端同步。前端采用astro，后端采用jdango框架，ai框架采用langchain（支持自行导入API）。现在我已经使用pycharm创建了项目目录，使用venv创建python3.14环境。

Codex会补充检查运行时条件（Python/Node 工具链）来约束技术方案，要根据需求回答Codex的多轮问答，随后Codex会生成一个详细的开发计划，包含技术选型、架构设计、功能模块划分、开发步骤等内容。

如果有更详细的需求，可以写一份md格式的需求文档，在对话里补充需求细节。

## Version control

## code

生成开发计划后，会在项目中创建一个计划文件，随后codex会询问是否开始实现该计划。codex会先一次性写入项目骨架和核心代码文件（后端 API、前端页面、计划文档、基础配置），然后再跑一轮本地自检确认路由和脚本没有明显错误。然后是喝茶时间，大概需要几十分钟左右，期间不要打断它，不要操作或移动终端窗口。

## Testing and bug fixing

TDD，测试用例也可以丢给 codex 写，但最好自己把把关。

## 部署

codex会要求授权以安装前后端等依赖，并进行构建检查自动修复错误，最后会给出前后端的启动命令。

启动该程序需要同时开两个进程：Django 后端（8000），Astro 前端（4321），命令（以cmd为例）分别是：

```angular2html
  // 后端（窗口1）
  cd .\apps\api
  python manage.py migrate
  python manage.py runserver 127.0.0.1:8000

  // 前端（窗口2）
  cd .\apps\web
  npm install
  npm run dev
```

日常操作在前端网页里进行，后端是给前端提供数据和能力的 API 服务，分工是：

- 前端（http://localhost:4321）：你点击、编辑、阅读、同步、提问 AI
- 后端（http://127.0.0.1:8000）：处理 RSS 抓取、存储、Git 同步、AI 调用

## optimize

新增功能：重复上面的步骤。

优化UI：可以让Codex使用组件库或参考其它应用的UI。

## workflow

### 版本管理

- 及时 Commit保证“存档点”，以便随时回滚。
- 及时 Push到远程仓库，保证代码安全。

### 分布开发

每个需求，开启一轮新的对话， 让 AI 聚焦于当下的任务。上下文越短，注意力越集中，出错率越低。完成一个 Feature，Close 掉，开启下一轮对话。

当你发现 AI 开始来回说车轱辘话、逻辑鬼打墙、或者死活改不对一个 Bug 时——不要纠缠！不要试图说服它！重新开启一轮新的对话。