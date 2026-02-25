---
title: "如何写 Git Commit？"
pubDate: 2025-12-03
description: "我常把提交信息当作一条会被海风带去远处的短信。它不是写给今天的自己，而是写给某个尚未抵达的你——在某个雨夜、某个凌晨、某个“为什么会这样”的时刻。好的 commit，不是炫技，而是让历史能被读懂，让故事能被追溯。"
author: "Elog"
image:
  url: ""
  alt: "Notebook and terminal light."
tags: ["git", "workflow", "writing", "devlog"]
likeCount: 0
shareCount: 0
docked: true
---

## 1) 先拆问题，再写句子

一个提交只说一件事。  
如果你发现自己在写“并且”“同时”，就说明应该拆成两个提交。

## 2) 用动词开头，告诉未来“发生了什么”

**推荐格式**（常见且清晰）：

```
feat: add terminal command panel
fix: correct blog tag filter
style: tighten spacing in post header
chore: update dependencies
```

- **动词**指向动作：add / fix / improve / remove / update  
- **对象**指向范围：terminal / blog / docs / config  

这是一种小小的秩序，像把石头排成一条能回家的路。

## 3) 保持简短，但不含糊

**坏例子**：
```
update
fix bug
changes
```

**好例子**：
```
fix(posts): avoid toc crash on empty headings
feat(blog): add pinned section to index
```

一句话应该能回答：**改了什么？为什么改？**

## 4) 需要时加上“原因”

当改动背后有风险或背景时，我会在提交里写清楚原因：

```
fix(nav): prevent sidebar overflow on small screens

The drawer was clipping content on iPhone SE.
```

这不是赘述，是给未来的自己准备的证词。

## 5) 让它能被检索

如果你的项目会生成变更日志，或者需要自动发布，建议遵循约定式提交：

```
feat(scope): summary
fix(scope): summary
```

这样你的历史不只是回忆，还能被机器理解。

## 6) 最后读一遍：它能否独立成句？

我会在提交前对着句子读一遍：

> “feat: add terminal command panel”  

它像一条路标。有人在夜里路过时，也许会凭它找到方向。

---

写 commit 其实是一种温柔的纪律。  
当你愿意在每次变化之后写上一句清楚的话，Git 就会替你把那些喧闹的日子整理成一条可读的时间线。  
而你终会在某个未来的夜晚，感谢那个愿意认真写 commit 的你。 
