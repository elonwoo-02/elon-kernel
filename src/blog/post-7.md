---
title: "如何用git回复误删的博客文章？"
pubDate: 2026-02-11
description: "在不破坏其他改动的前提下，把 `src/blog` 恢复到指定提交后的正确状态，并可安全提交。"
author: "Elon Woo"
tags: ["git", "workflow", "devlog", "blogging"]
likeCount: 0
shareCount: 0
docked: false
---

## 0. 先判断是否真的删了

第一步不要急着回滚，先确认删除范围：

```bash
git status -sb
```

如果看到类似 `D src/blog/post-1.md`，说明是工作区删除；如果远端也没了，再走后面的“恢复 + 提交 + 推送”。

## 1. 找到恢复基准提交

只看博客目录历史，避免被其他文件干扰：

```bash
git log --oneline -- src/blog
```

再对可疑提交做一次文件级确认：

```bash
git show --name-status --oneline <commit>
```

这一步的标准是：找到“文章还在、内容正确”的那个提交（比如你提供的 `91e90b...` 及其后续目标版本）。

## 2. 按目录精准恢复（核心）

恢复命令：

```bash
git restore --source <good_commit> -- src/blog
```

这条命令只影响 `src/blog`，不会改动其他目录，比 `reset --hard` 安全得多，适合线上正在开发中的仓库。

## 3. 恢复后做三层验证

先看文件是否回来了：

```bash
Get-ChildItem src/blog
git status --short -- src/blog
```

再看内容构建是否正常：

```bash
npm run build
```

如果构建出现 `Duplicate id "post-x"`，通常是两个目录里有同名 slug，需要统一文章来源（例如只保留 `src/blog`）。

## 4. 提交并推送恢复结果

确认无误后单独提交，便于追踪：

```bash
git add src/blog
git commit -m "fix(blog): restore deleted posts"
git push origin main
```

## 5. 常见坑

- 不要用 `git reset --hard` 直接回退整库，容易误伤其他改动。
- 不要只恢复单个文件后就结束，先跑构建，确认路由和内容索引没问题。
- 不确定提交时，优先 `git log -- src/blog` 和 `git show <commit> -- src/blog`，再恢复。

## 6. 一套可复用的最短流程

```bash
git status -sb
git log --oneline -- src/blog
git restore --source <good_commit> -- src/blog
npm run build
git add src/blog
git commit -m "fix(blog): restore deleted posts"
git push origin main
```

这套流程的核心原则是：范围小、可验证、可回溯。
