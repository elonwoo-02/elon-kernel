---
title: "Vibe Coding Isn't Dumb - You're Just Doing It Wrong"
pubDate: 2026-02-23
description: "A practical guide for shipping apps with AI & minimal pain. Vibe coding gets a lot of hate, especially from 'serious' devs. But the truth is: not every project needs to be scalable, secure, or architected like it's going public on the stock market. Most of the time, you just want to turn your idea into a working app - fast. Here's how to do it without driving yourself insane. These aren't fancy tricks, just things that work."
author: "from network"
tags: ["vibe coding", "AI development"]
likeCount: 0
shareCount: 0
docked: true
---

# Tech Stack

| 类别 (Category)           | 工具 (Tools)         |
| ------------------------- | -------------------- |
| Research and discovery    | Perplexity, Grok     |
| UI component generator    | v0                   |
| App and website builder   | Lovable, Replit      |
| Mobile apps builder       | Rork                 |
| AI IDE                    | Cursor, Claude       |
| Agentic workflow          | n8n, LangGraph       |
| AutoRAG                   | LlamaIndex, Flowise  |
| Database                  | Supabase             |
| Authentication            | Stack Auth           |
| Subscriptions             | RevenueCat           |
| Documentation             | Mintlify, NotebookLM |
| Deployment                | Vercel, Railway      |
| Fast collaborative editor | Zed Industries       |
| Image generation          | Recraft, Gemini      |

---

# Workflow Orchestration

## 1. Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

## 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

## 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

## 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

## 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

## 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

# Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

# Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

# YC Guide to Vibe Coding

## Planning process

- **Create a comprehensive plan**: Start by working with the AI to write a detailed implementation plan in a markdown file
- **Review and refine**: Delete unnecessary items, mark features as won't do if too complex
- **Maintain scope control**: Keep a separate section for ideas for later to stay focused
- **Implement incrementally**: Work section by section rather than attempting to build everything at once
- **Track progress**: Have the AI mark sections as complete after successful implementation
- **Commit regularly**: Ensure each working section is committed to Git before moving to the next

## Version control strategies

- **Use Git religiously**: Don't rely solely on the AI tools' revert functionality
- **Start clean**: Begin each new feature with a clean Git slate
- **Reset when stuck**: Use git reset --hard HEAD if the AI goes on a vision quest
- **Avoid cumulative problems**: Multiple failed attempts create layers and layers of bad code
- **Clean implementation**: When you finally find a solution, reset and implement it cleanly

## Testing framework

- **Prioritize high-level tests**: Focus on end-to-end integration tests over unit tests
- **Simulate user behavior**: Test features by simulating someone clicking through the site/app
- **Catch regressions**: LLMs often make unnecessary changes to unrelated logic
- **Test before proceeding**: Ensure tests pass before moving to the next feature
- **Use tests as guardrails**: Some founders recommend starting with test cases to provide clear boundaries

## Effective bug fixing

- **Leverage error messages**: Simply copy-pasting error messages is often enough for the AI
- **Analyze before coding**: Ask the AI to consider multiple possible causes
- **Reset after failures**: Start with a clean slate after each unsuccessful fix attempt
- **Implement logging**: Add strategic logging to better understand what's happening
- **Switch models**: Try different AI models when one gets stuck
- **Clean implementation**: Once you identify the fix, reset and implement it on a clean codebase

## AI tool optimization

- **Create instruction files**: Write detailed instructions for your AI in appropriate files (cursor.rules, windsurf.rules, claude.md)
- **Local documentation**: Download API documentation to your project folder for accuracy
- **Use multiple tools**: Some founders run both Cursor and Windsurf simultaneously on the same project
- **Tool specialization**: Cursor is a bit faster for frontend work, while Windsurf thinks longer
- **Compare outputs**: Generate multiple solutions and pick the best one

## Complex feature development

- **Create standalone prototypes**: Build complex features in a clean codebase first
- **Use reference implementations**: Point the AI to working examples to follow
- **Clear boundaries**: Maintain consistent external APIs while allowing internal changes
- **Modular architecture**: Service-based architectures with clear boundaries work better than monorepos

## Tech stack considerations

- **Established frameworks excel**: Ruby on Rails works well due to 20 years of consistent conventions
- **Training data matters**: Newer languages like Rust or Elixir may have less training data
- **Modularity is key**: Small, modular files are easier for both humans and AIs to work with
- **Avoid large files**: Don't have files that are thousands of lines long

## Beyond coding

- **DevOps automation**: Use AI for configuring servers, DNS, and hosting
- **Design assistance**: Generate favicons and other design elements
- **Content creation**: Draft documentation and marketing materials
- **Educational tool**: Ask the AI to explain implementations line by line
- **Use screenshots**: Share UI bugs or design inspiration visually
- **Voice input**: Tools like Aqua enable 140 words per minute input

## Continuous improvement

- **Regular refactoring**: Once tests are in place, refactor frequently
- **Identify opportunities**: Ask the AI to find refactoring candidates
- **Stay current**: Try every new model release
- **Recognize strengths**: Different models excel at different tasks

---

# Vibe Coding Isn't Dumb - You're Just Doing It Wrong

_(A practical guide for shipping apps with AI & minimal pain)_

Vibe coding gets a lot of hate, especially from "serious" devs. But the truth is: not every project needs to be scalable, secure, or architected like it's going public on the stock market.

Most of the time, you just want to turn your idea into a working app - fast. Here's how to do it without driving yourself insane. These aren't fancy tricks, just things that work.

### 1. Pick a mainstream tech stack (zero effort, high reward)

If you're building a basic website, just use Wix, Framer, BlackBoxAI or any other site builder. You don't need to code it from scratch.

If you need a real web app:
Use **Next.js + Supabase**.

Yes, Svelte is cool, Vue is nice, but none of that matters when you're trying to get something done. Next.js wins because it has the largest user base, the most examples online, and AI is most likely to get it right. If your backend needs real logic, add Python.

If you're thinking about building a game:
Learn **Unity or Unreal**.

Trying to vibe-code a game in JavaScript is usually a dead end. Nobody's playing your Three.js experiment. Be honest about what you're building.

⚠️ Skip this rule and you'll burn days fixing the same bugs that AI could've solved in seconds - if only you'd picked the stack it knows best.

### 2. Write a simple PRD (medium effort, high reward)

You don't need a fancy spec doc. Just write a **Product Requirement Document** that does two things:

- Forces you to clarify what you actually want.
- Breaks the work into small, clear steps.

Think of it like hiring a contractor. If you can't write down what "done" looks like for Day 1 or Week 1, your AI won't know either.

Once you've got the plan, give the AI **one step at a time**. Not "do everything at once."

Example:
**Chat 1:**
`"Implement Step 1.1: Add Feature A"`

Test it. Fix it. Then:

**New Chat:**
`"Implement Step 2: Add Feature B"`

Bugs compound over time, so fixing them early saves you from a mess later.

### 3. Use version control (low effort, high reward)

AI will eventually break your code. Period.

You need a way to roll back. Most tools have automatic checkpoints, but it's better to use Git. Manual commits force you to actually track progress, so when AI makes a mess, you'll know exactly where to revert.

### 4. Provide working code samples (medium effort, high reward)

Don't assume AI will get third-party libraries or APIs right just from docs.

Before you start building a full feature, write a **small working script** that does the core thing (e.g., pull 10 Jira tickets). Once it works, save it, and when you start the real task, pass it back into your AI prompts as a reference.

This small step will save you from wasting hours on tiny mismatches (wrong API version, bad assumptions, missing auth headers, etc.).

### 5. When stuck, start a new chat with better info (low effort, high reward)

The "copy error paste to chat fix new error repeat" cycle is a trap.

When you hit this loop, stop. Open a fresh chat and tell the AI:

- What's broken.
- What you expected to happen.
- What you've already tried.
- Include logs, errors, screenshots.

The longer your chat history gets, the dumber the AI gets. A clean context and clear input often solves what endless retries won't.
