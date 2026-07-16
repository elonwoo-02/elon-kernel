---
title: "我常使用的 Git 命令与应用场景"
pubDate: 2025-09-18
description: "记录常用 Git 命令与应用场景，强调触发条件和关键注意事项。"
author: "Elog"
image:
  url: ""
  alt: "Terminal window on a dark background."
tags: ["git", "workflow", "tools", "devlog"]
likeCount: 0
shareCount: 0
docked: true
---

在我那间终端微微发热的房间里，Git 是在不断变化的工作状态之间做判断的核心逻辑。本文将这组命令按照能力分类，列出触发条件、实际目的以及需要留意的点，方便日常以更技术化的方式审视每一次操作。

## 1. 检查工作树状态

**命令**

```bash
git status -sb
```

**触发条件**：进入工作目录后、准备提交前或刚切换分支完成。

**目的**：快速确认当前 HEAD 所在分支、暂存区与工作区差异，以及是否跟远端失联。

**关注点**：默认输出是概要，遇到暂存冲突或未跟踪文件时补充 `git status`，也可以加 `-uno` 过滤远端分支信息。

## 2. 精准暂存变更

**命令**

```bash
git add .
git add -p
```

**触发条件**：工作中出现跨多个逻辑的改动，或者想保持每个提交语义清晰。

**目的**：`git add .` 一次性准备全部改动；`git add -p` 则可以在 hunk 级别拆分、审查并暂存，将逻辑单元隔离。

**关注点**：`-p` 进入交互模式，依次处理每个 hunk，适合把一份文件的多个改动拆成不同提交；遇到大型改动可配合 `git diff --cached` 二次确认。

## 3. 形成语义化提交

**命令**

```bash
git commit -m "feat: add terminal command panel"
```

**触发条件**：暂存区内容经过确认、准备将这部分变更写入历史。

**目的**：通过 `type(scope): description` 结构表达改动类别与范围，便于线性回顾或自动化发布。

**关注点**：描述应聚焦“为什么”而非“做了什么”，复杂变更可在正文中添加额外段落补充上下文。

## 4. 对比变更

**命令**

```bash
git diff
git diff --staged
```

**触发条件**：提交前、复盘 Bug 或查看大改动范围。

**目的**：`git diff` 比较工作区与 HEAD，`--staged` 比较暂存区与 HEAD，两者结合可以完整掌握当前影响面。

**关注点**：对比结果会显示空格/行尾的微小差异，必要时加入 `--word-diff` 或 `--color-words` 检查逻辑变更。

## 5. 取消错误操作

**命令**

```bash
git restore path/to/file
git restore --staged path/to/file
```

**触发条件**：误修改文件、错误地暂存或准备放弃某些改动。

**目的**：让工作区或暂存区回到 HEAD 状态，不污染历史的新提交。

**关注点**：`restore` 不会删除历史，只影响当前工作区；想彻底恢复旧文件可配合 `git checkout --`（旧命令）。

## 6. 暂存未完成的进度

**命令**

```bash
git stash push -m "wip: dock polish"
git stash pop
```

**触发条件**：需要临时切换分支处理紧急任务、但尚未完成当前开发。

**目的**：将改动收进栈里，保持当前分支干净，后续可继续工作。

**关注点**：`pop` 会尝试自动合并到当前分支；若有多个 stash，使用 `git stash list` 查看 ID，配合 `apply <id>` 精准恢复。

## 7. 与远端保持一致

**命令**

```bash
git fetch origin
git pull --rebase
git push origin main
```

**触发条件**：每天工作开始、上线前或准备提交前的最后一次同步。

**目的**：`fetch` 更新远端引用但不自动合并；`pull --rebase` 线性地将本地改动附加在远端之后；`push` 将整理后的提交上传到主干。

**关注点**：`--rebase` 会重写本地提交，必须用 `--force-with-lease` 确保不覆盖远端其他协作者的提交。

## 8. 回顾历史线索

**命令**

```bash
git log --oneline --graph --decorate -20
git blame path/to/file
```

**触发条件**：想确认某行代码是谁写的、或到底什么时候引入的行为。

**目的**：`log` 用图形视图来看演进轨迹，`blame` 精准到某行的最近提交。

**关注点**：`blame` 主要显示的是最后修改人的信息，若怀疑是更早的改动，可结合 `git show <commit> -- path/to/file` 精确回溯。

## 9. 重写历史以提升可读性

**命令**

```bash
git rebase -i HEAD~5
```

**触发条件**：本地提交过多、含有乱七八糟的信息，或希望合并/改写提交信息。

**目的**：交互式 rebase 允许把多个提交 `squash`、`fixup`、重排序或改名，让历史成为一条干净的叙述。

**关注点**：完成操作后可能需要 `git push --force-with-lease`；编辑过程中要耐心确认每一步，`drop` 命令会直接丢弃相应提交。

## 10. 管理分支上下文

**命令**

```bash
git switch -c feature/terminal
git switch main
```

**触发条件**：准备启动新功能/实验，或结束一个短期分支。

**目的**：`switch -c` 将当前 HEAD 移到新分支，避免在主干上直接搞实验；`switch main` 可回到稳定提交线。

**关注点**：完成开发后不要忘记 `git push --set-upstream origin feature/terminal`，否则下一次 `git switch` 不会自动跟踪远端。

---

## 历史重写策略

### 交互式 rebase（编辑／压缩）

1. 运行 `git rebase -i HEAD~4`，定位要压缩的最近提交。
2. 将待合并提交前的 `pick` 改为 `squash`（保留提交信息）或`s`,  `fixup`（丢弃被合并的消息）。
3. 按提示编辑合并后的提交信息，保存退出即可完成历史重写。
4. 所有步骤结束后，使用 `git push --force-with-lease` 推送变更，避免覆盖远端其他协作者的提交。

### Soft reset + 重新提交

1. 运行 `git reset --soft <commit_id>` 回到某个提交之前，暂存区仍保留现有内容。
2. 使用 `git add -u` 将所有变更整合入暂存区。
3. 执行 `git commit -m "合并提交信息"`，为这段变更生成一个新的提交。
4. 再次用 `git push --force-with-lease` 更新远端。

**注意**：`reset --soft` 会移动 HEAD，当多人协作时，请先创建备份分支（例如 `git branch backup/feature`）或向队友说明计划。历史重写时务必确认没有人依赖这些提交。

这些命令之所以常用，不是因为它们复杂，而是因为它们像日常生活中的杯子、门、钥匙，早晚都要用到。把每一次变化写清楚、放整齐，Git 就能在某个夜晚替你记住那段潮湿的时间。
