---
title: 文献综述 | 知识图谱与 Agent Harness 融合
pubDate: 2026-07-21
description: 本文提出'组件—语义—编排'三维评估框架，系统梳理知识图谱在Agent Harness七个核心组件中的融合方案与增强效果。
author: Eland Woo
image:
  url: https://cdn1.deepmd.net/static/img/5a0fc5b2generated-call_c57430399c594a20ba1f94ee.png
  alt: KG增强Agent Harness的三维评估框架
tags:
  - 知识图谱
  - Agent
  - LLM
---

## 摘要

大型语言模型驱动的智能体（LLM
Agent）正从简单的"模型+工具"范式向具有标准化组件接口的Agent
Harness架构演进，涵盖配置层、行为控制层、能力扩展层、工具连接层和多智能体协作层。然而，当前Agent
Harness各组件之间的知识共享仍以非结构化文本为主，缺乏统一的语义表示层，导致组件间协作效率低下、知识复用困难。本文提出"组件—语义—编排"三维评估框架，系统梳理知识图谱（Knowledge
Graph, KG）在Agent
Harness七个核心组件（上下文管理、事件驱动控制、技能发现与组合、插件生态、代码智能、工具调用、多智能体协作）中的融合方案与增强效果。研究发现，知识图谱正从Agent的"外部知识源"演进为Agent
Harness内部的"统一语义层"：在上下文管理层面，KG将静态文本配置升级为动态可推理的知识上下文图谱；在事件控制层面，事件知识图谱赋予Hooks超越静态规则的语义决策能力；在技能层面，技能知识图谱实现了从离散技能列表到可组合能力网络的转变；在工具调用和多智能体协作层面，KG为工具发现、工具链规划和Agent能力编配提供了结构化的语义协调基础。本文还分析了各组件中KG融合的差异化成熟度，识别了实时推理延迟、自动化图谱构建和跨领域泛化等核心挑战，并展望了自演化知识图谱、联邦式多Agent知识共享和面向Agent
OS的统一知识基础设施等未来方向。

**关键词:** 知识图谱；Agent
Harness；大型语言模型；智能体架构；语义层；多智能体协作；技能编排

## 1 引言

大型语言模型（Large Language Models,
LLMs）的快速发展正在深刻重塑智能体（Agent）系统的设计范式。从早期基于规则的专家系统到当前以LLM为核心的自主智能体，Agent架构经历了从封闭式知识库到开放式推理能力的根本性转变\[1\]。最新的LLM
Agent综述表明，这些系统已从简单的"模型+工具"调用模式发展为具有标准化组件接口的复杂架构，涵盖配置管理、行为控制、能力扩展、工具连接和多智能体协作等多个层次\[2\]。

在这一演进过程中，一个关键趋势逐渐显现：Agent
Harness的概念正在成为Agent系统设计的主流范式。Agent
Harness指的是将Agent系统分解为可组合、可替换的标准化组件集合，包括用于系统知识管理的CLAUDE.md配置层、用于事件驱动控制的Hooks机制、用于能力封装的Skills模块、用于扩展生态的Plugins接口、用于代码智能的LSP（Language
Server Protocol）集成、用于工具调用的MCP（Model Context
Protocol）服务器以及用于多智能体协同的Subagents子系统\[3\]。然而，当前Agent
Harness各组件之间的知识共享仍以非结构化文本为主要载体，缺乏统一的语义表示层。这种结构性的缺失导致了三个关键问题：组件间协作效率低下，因为每个组件需要独立解析和推理其他组件输出的非结构化信息；知识复用困难，因为Agent难以在不同任务之间迁移已经验证的知识结构；以及行为一致性难以保证，因为缺乏跨组件的语义一致性约束。

知识图谱（Knowledge Graph,
KG）作为一种结构化、可推理的语义表征技术，为解决上述问题提供了独特的潜力\[4\]。长期以来，KG在检索增强生成（RAG）和GraphRAG等范式中被用作Agent的外部知识源，但这一视角低估了KG作为Agent内部架构组件——而非仅仅是外部知识供给——的变革性价值。本文认为，知识图谱正从Agent的"外部知识源"演进为Agent
Harness内部的"统一语义层"（Unified Semantic
Layer），即一种贯穿所有Harness组件的结构化知识表示，使组件之间能够以一致的语义进行交互、推理和协作。

为系统评估这一范式转变，本文提出"组件—语义—编排"三维评估框架。组件维度涵盖Agent
Harness的七个核心组件：CLAUDE.md（上下文管理）、Hooks（事件驱动控制）、Skills（技能发现与组合）、Plugins（插件生态）、LSP（代码智能）、MCP
Server（工具调用）和Subagents（多智能体协作）。语义维度从实体链接、关系推理和图结构查询三个层面评估KG在每个组件中的语义增强深度。编排维度从发现、组合、治理和演化四个阶段评估KG对各组件能力编排的支撑程度。图
1以三维架构图的形式展示了该框架的整体结构。以独立LLM
Agent和基于RAG的Agent为基线，该框架能够系统评估KG融合方案对各组件的增强效果与适用边界。

<figure>
<img src="https://cdn1.deepmd.net/static/img/5a0fc5b2generated-call_c57430399c594a20ba1f94ee.png" style="width:85.0%" />
<figcaption>图 1. KG增强Agent Harness的三维评估框架</figcaption>
</figure>

本文的组织结构如下：第2节回顾知识图谱和Agent技术的核心基础，建立必要的技术上下文；第3至第7节分别深入分析KG在上下文管理、事件驱动控制、技能发现与组合、插件生态与代码智能、工具调用与多智能体协作五个Harness组件群中的融合方案；第8节从"组件—语义—编排"三维框架出发，讨论当前挑战与未来方向；第9节总结全文的核心发现。

## 2 知识图谱与Agent技术基础

知识图谱的结构化语义表征与LLM
Agent的灵活推理能力形成互补——KG提供可解释、可验证的事实基础，而Agent
Harness的组件化架构为KG的系统性融入提供了标准化的接入点。两者的融合正从松耦合的"外部知识源"模式向紧耦合的"内部语义层"模式演进。

### 2.1 知识图谱核心技术回顾

知识图谱技术栈已从静态知识库演进为支持动态更新、推理增强和语义查询的智能知识基础设施。在构建层面，实体识别与链接技术已经从基于规则的方法演进为基于预训练语言模型的端到端方案，能够从非结构化文本中自动抽取实体及其关系。关系抽取技术则从传统的远程监督方法发展为基于提示学习和少样本学习的新范式，显著降低了对人工标注数据的依赖。在图推理方面，图神经网络（Graph
Neural Networks,
GNNs）已成为知识图谱推理的核心工具，包括基于消息传递的GCN、基于注意力的GAT和基于关系路径的R-GCN等变体，能够有效捕获图谱中的结构和语义信息\[5\]。知识图谱补全技术通过链接预测和三元组分类来推断缺失的知识，近年来基于Transformer的模型如KG-BERT和基于对比学习的方法在这一领域取得了显著进展。在图谱存储和查询方面，Neo4j等原生图数据库和RDF三元组存储系统为大规模知识图谱提供了高效的存储和查询能力，而SPARQL和Cypher等图查询语言则为复杂的图模式匹配提供了标准化的接口\[6\]。

### 2.2 LLM Agent架构与Harness范式

Agent
Harness将Agent系统从"单一LLM+工具"的简单模式演化为具有标准化接口的组件化架构，为知识图谱的系统性融入提供了结构化的接入点。LLM
Agent的典型架构范式包括ReAct（Reasoning and
Acting）、Plan-Execute和Reflection三种主流模式。ReAct范式将推理和行动交替进行，允许Agent在每一步基于当前观察调整策略；Plan-Execute范式则先制定完整计划再逐步执行，适合结构化任务；Reflection范式在行动后引入自我评估和修正环节，增强了Agent的自我改进能力\[2\]。

Harness框架的组件化设计理念将这些范式抽象为可组合的标准化接口。配置层（以CLAUDE.md为代表）定义了Agent的系统级行为规范和知识边界；行为控制层（Hooks）通过事件驱动机制在Agent生命周期关键节点注入控制逻辑；能力扩展层（Skills）将可复用的能力封装为模块化组件；工具连接层（MCP）通过标准化协议统一了Agent与外部工具的交互方式；多智能体协作层（Subagents）则实现了Agent之间的任务分配和协同推理\[3\]。这种组件化架构的标准化程度正在不断提高，为将KG作为统一的语义层嵌入Agent内部提供了系统性的技术基础。

### 2.3 KG与LLM融合的技术现状

当前KG-LLM融合研究多聚焦于知识检索增强，尚未系统性地将KG融入Agent
Harness的内部组件架构中，这构成了本文的核心研究动机。KG增强RAG（Retrieval-Augmented
Generation）是目前最广泛采用的融合范式，其基本思路是将知识图谱中的结构化知识作为LLM推理的外部上下文。GraphRAG在此基础上进一步利用图结构进行多跳推理和关系感知的检索，能够处理更复杂的知识查询\[7\]。神经符号推理则将KG中的符号知识与LLM的神经网络推理能力相结合，通过将图查询转化为可微操作来实现端到端的知识推理\[5\]。

表 1从知识表示、典型应用和对Agent
Harness的增强程度三个维度对主流融合范式进行了分类对比。这些现有方案存在三个共同局限：首先，它们多从"外部知识源"视角出发，将KG视为Agent的附属信息供给，而非Agent内部架构的有机组成部分\[8\]；其次，它们缺乏对Agent
Harness各组件（如Hooks、Skills、Subagents）的系统性语义增强，每个组件仍然独立维护自身的知识表示；第三，它们未能实现跨组件的统一语义协调，导致Agent在复杂任务中难以在上下文管理、技能选择、工具调用和行为控制之间形成一致的语义理解。这些局限构成了本文的核心研究动机：将KG从Agent的外部知识源升级为Agent
Harness内部的统一语义层。

表 1. KG-LLM融合范式分类对比

| 融合范式          | 知识表示    | 典型应用   | 对Agent Harness的增强 | 代表工作     |
|:------------------|:------------|:-----------|:----------------------|:-------------|
| KG增强RAG         | 三元组+文本 | 事实性问答 | 限于上下文注入        | \[7\]        |
| GraphRAG          | 图结构      | 多跳推理   | 限于检索增强          | \[9\]        |
| 神经符号推理      | 符号+向量   | 复杂推理   | 潜在可扩展至Hooks     | \[5\]        |
| 知识图谱增强Agent | 统一语义层  | 全组件增强 | 贯穿所有Harness组件   | 本文核心主题 |


## 3 知识图谱增强Agent上下文管理

知识图谱将Agent上下文从静态文本配置升级为动态可推理的知识层，通过结构化语义表征实现上下文检索的精准化、知识更新的可追溯化以及多源知识的自动一致性检测。本节按知识表示、动态注入、治理演化的递进逻辑组织，从底层数据建模到上层治理形成完整的上下文管理技术栈。

### 3.1 从文本配置到知识上下文图谱

KG将Agent配置从平面文本提升为结构化、可推理的知识图谱，使得Agent能够理解配置项之间的语义关系而非仅执行关键词匹配。传统的CLAUDE.md等文本配置本质上是一种平面化的知识表示，Agent需要通过关键词匹配或语义搜索来定位相关信息，这种方法无法表达配置项之间的依赖关系、优先级和适用条件。当Agent需要根据多个配置项的组合做出决策时——例如，在特定用户权限下选择合适的数据处理策略——文本配置需要Agent在推理过程中手动解析和组合多个独立段落，容易产生遗漏或矛盾。

知识上下文图谱（Knowledge Context
Graph）通过将配置项组织为节点和关系，使Agent能够直接在图结构上遍历和推理\[10\]。具体而言，配置项被建模为实体节点（如"用户权限策略"、"数据加密标准"），关系边则编码了配置项之间的语义依赖（如"适用条件"、"优先级高于"、"与...冲突"）。这种结构化表示使得Agent可以通过图遍历算法自动解析配置组合，通过路径查询验证配置一致性，以及通过子图匹配发现隐含的配置约束。AGENTiGraph平台通过多智能体架构将用户意图动态解释为知识图谱交互，证明了结构化知识表示在复杂任务管理中的有效性\[10\]。实验表明，基于KG的配置管理在知识交互的准确率上达到了95.12%，远优于传统的文本检索方法。

### 3.2 基于KG的动态上下文注入

基于KG的动态上下文注入使Agent能够根据任务语义从知识图谱中精准检索相关信息，克服了固定长度上下文窗口的信息瓶颈。LLM的上下文窗口虽然在持续扩展，但将完整的Agent配置、历史交互和领域知识全部注入上下文既不经济也不高效。KG驱动的动态上下文注入通过语义检索机制，将Agent当前任务转化为图查询，仅检索最相关的知识子图作为上下文\[11\]。

典型的动态注入流程包括四个阶段：用户任务、KG查询、动态Context生成、Agent注入。首先，Agent将用户任务解析为语义意图，然后通过图嵌入或自然语言查询在知识图谱中定位相关子图。接着，检索到的子图被转化为结构化的文本表示，与原始任务组合后注入Agent的上下文窗口。Ocker提出的基于知识图谱的记忆系统将视觉语言模型与实体消歧结合，通过知识图谱增强的向量嵌入实现语义搜索和图查询生成的协同，在真实场景中验证了该方法在信息检索效率上的优势\[11\]。

在记忆管理方面，Zep提出了一种时间知识图谱架构，专门用于Agent的长期记忆管理\[12\]。该架构通过时间标签建模知识的演化过程，使Agent能够追踪知识的时间有效性，并在知识过期时自动降权或归档。Jang等人的混合会话对话系统进一步表明，以自我为中心的记忆管理在长期多会话交互中至关重要，其EMMA模型通过以Speaker为中心的记忆收集和检索机制，在多轮对话中保持了高水平的记忆一致性\[13\]。

### 3.3 知识一致性与上下文治理

KG的图结构天然支持多源知识的冲突检测和版本演化管理，为Agent上下文治理提供了可审计的语义基础。随着Agent在多轮交互中不断积累知识，上下文中的信息可能来自多个来源，这些来源之间可能存在矛盾、冗余或过时的情况。基于图结构的一致性验证方法通过检测知识图谱中的语义冲突——例如，两条关系边对同一实体属性给出了不同值，或者一条路径的推理结论与另一条路径矛盾——来自动识别不一致性\[14\]。

Hofmeister等人提出的语义Agent框架通过动态知识图谱自动评估洪水事件的影响，展示了KG在上下文治理中持续更新和级联推理的能力。该框架在检测到新数据（如洪水预警）时，通过Agent链自动触发图谱更新，并级联传播影响评估结果，确保所有关联实体保持一致性\[14\]。此外，KGroot通过图卷积神经网络增强的根因分析，在复杂系统中实现了基于知识图谱的异常溯源和上下文一致性验证\[15\]。在知识版本管理方面，时间知识图谱通过为每条知识边附加时间戳和置信度，支持Agent回溯知识的演化历史，并根据时效性自动选择最合适的知识版本\[16\]。

## 4 知识图谱增强事件驱动Agent控制

知识图谱为Agent
Hooks提供超越静态规则引擎的语义决策能力：通过事件知识图谱建模Agent生命周期，实现上下文感知的动态规则触发、基于图推理的复杂条件判断和可审计的行为治理。本节按事件建模、规则触发、行为治理的递进逻辑组织，从事件感知到行为管控形成闭环的事件驱动控制体系。

### 4.1 Agent生命周期事件建模

事件知识图谱使Agent
Hooks从孤立的触发点升级为具有因果语义的事件网络，支持跨事件的上下文推理和异常模式识别。Agent
Hooks的典型生命周期事件包括Before Prompt（提示前）、Before Tool
Call（工具调用前）、After Tool Call（工具调用后）和After
Response（响应后），这些事件在传统实现中通常被建模为独立的触发点，每个触发点只能访问当前事件的局部上下文，无法感知事件之间的因果关联\[17\]。

事件知识图谱（Event Knowledge
Graph）通过将Agent生命周期事件建模为事件节点，并建立事件之间的因果、时序和条件关系边，使Agent能够理解事件链的语义结构\[18\]。图
2展示了事件知识图谱驱动的Agent
Hooks控制流程，从事件捕获到行为治理形成完整的闭环。例如，"工具调用失败"事件可以通过因果边连接到"回退策略激活"事件，而"回退策略激活"又可以通过条件边连接到"用户确认请求"事件。这种建模方式支持基于图遍历的事件前摄推理——Agent可以在事件发生前预测可能的结果链并提前准备应对策略——以及基于子图匹配的异常事件模式识别。

<figure>
<img src="https://cdn1.deepmd.net/static/img/9345467fgenerated-call_54cdab73a88449b993780cc6.png" style="width:85.0%" />
<figcaption>图 2. 事件知识图谱驱动的Agent Hooks控制流程</figcaption>
</figure>

Berti等人提出的对象中心过程挖掘技术为事件知识图谱的构建提供了方法论基础，通过从事件日志中自动发现事件之间的关联关系，能够有效捕获Agent生命周期中的隐含事件依赖\[18\]。Yang等人进一步将动态事件-状态知识图谱应用于边缘-云协同产品服务系统的设计，展示了事件知识图谱在复杂系统中的实时建模能力\[19\]。

### 4.2 KG驱动的自动化规则触发

KG驱动的规则触发机制将Agent行为控制从硬编码的规则匹配提升为基于语义的灵活推理，显著增强了Agent对复杂场景的适应能力。传统的if-else规则引擎要求开发者预先枚举所有可能的状态组合和对应的触发条件，这在Agent面临开放域任务时既不现实也不可靠——未预见的场景会导致规则失效，而规则的增量更新又会引入一致性问题。

基于KG的规则引擎通过三种机制克服了这些局限。第一，图遍历实现动态规则匹配：将规则条件表示为图模式，当前Agent状态通过子图同构匹配自动定位适用的规则，无需枚举所有状态组合。第二，子图同构支持复杂条件推理：当规则条件涉及多个实体及其关系时（如"当用户权限为X且数据敏感度高于Y且当前操作涉及实体Z"），图匹配可以在一次查询中完成所有条件的验证。第三，语义相似度实现规则泛化：当没有精确匹配的规则时，通过图嵌入的语义相似度计算，Agent可以找到最接近的适用规则并进行自适应调整\[20\]。

Caldwell等人提出的混合人机协作研究框架为规则触发提供了分层控制的思路：常规操作由KG规则引擎自动处理，高风险决策则升级至人类审查，而规则的学习和更新则通过人机交互的反馈循环持续进行\[20\]。在安全领域，Walid等人利用语义上下文建立电子健康记录的访问控制规则，展示了基于KG的权限控制如何通过捕捉数据之间的语义关系来超越传统的基于角色的访问控制\[21\]。

### 4.3 基于KG的Agent行为治理

KG为Agent行为治理提供了统一的语义基础，使得权限控制、风险检测和操作审计能够在同一图结构上协同运作。传统的行为治理通常依赖分散的日志分析、独立的权限系统和外部审计工具，这些系统之间缺乏语义互操作性，导致治理碎片化。

权限知识图谱将Agent的访问控制策略建模为图结构，节点包括用户、Agent、资源、操作和权限等级，关系边则编码了授权关系、委托关系和约束条件。这种表示方式支持基于图遍历的细粒度访问控制：当Agent请求执行某项操作时，系统在图谱中遍历从"Agent"节点到"资源"节点的所有授权路径，只有当存在有效路径时才允许操作\[21\]。图异常检测则通过识别图谱中的异常模式——如突然出现的新授权关系或异常频繁的权限提升——来检测潜在的安全风险。

在审计方面，基于KG的审计日志将Agent的操作记录组织为事件图谱，每次操作都被建模为带有时间戳、操作者、操作对象和上下文信息的事件节点。这种结构化审计使得安全分析人员可以通过图查询快速追踪操作的因果链，定位安全事件的源头，并评估事件的影响范围\[22\]。Lanzola等人提出的案例管理器在FHIR分布式推理环境中实现了KG驱动的知识源激活控制，通过Agent协调知识源的调用，在临床决策支持场景中验证了KG在行为治理中的可审计性优势\[22\]。

## 5 知识图谱增强技能发现与组合

技能知识图谱将Agent的能力空间从离散的技能列表升级为可推理、可组合的语义网络，通过图结构实现技能的语义检索、自动组合和持续演化，支撑Agent从"工具使用者"向"能力编排者"的转变。本节按图谱构建、语义检索、自动演化的递进逻辑组织，从静态能力表示到动态能力生成形成完整的技能生命周期管理。

### 5.1 技能知识图谱构建

技能知识图谱将Agent的能力空间形式化为可查询、可推理的语义网络，使得技能之间的关系（依赖、组合、替代）能够被Agent自动理解和利用。技能知识图谱的节点类型包括Task（任务）、Skill（技能）、Subskill（子技能）、Tool（工具）和Output（输出），关系类型包括requires（依赖）、depends_on（前置条件）、produces（产出）和improves（增强）。这种本体论定义使得技能不再是无序的文本描述集合，而是具有明确语义边界的结构化能力单元\[23\]。

从技能文档、执行日志和代码仓库中自动抽取技能关系是构建技能知识图谱的核心挑战。Su等人提出的技能检索增强（Skill
Retrieval Augmentation,
SRA）范式为此提供了方法论框架：通过从大规模技能语料库中自动提取技能的功能描述、输入输出接口和执行约束，构建结构化的技能表示\[24\]。SRA-Bench基准测试包含了5,400个能力密集型测试实例和636个手工构建的金标准技能，与26,262个Web收集的干扰技能混合，形成了大规模技能检索的标准化评估体系。该基准的关键发现是，Agent在技能加载率上表现出显著的不敏感性——即使检索到了正确的技能，Agent也可能不加区分地加载所有技能，这揭示了技能增强的瓶颈不仅在于检索，还在于基础模型判断"何时需要外部技能"的能力。

### 5.2 KG驱动的技能检索与匹配

KG驱动的技能检索超越了关键词匹配，通过图结构语义理解实现任务需求与技能能力的精确对齐，支持多技能协同工作流的自动生成。传统的技能检索通常依赖文本嵌入的余弦相似度，这种方法在技能描述语义相近但功能不同时容易产生混淆——例如，"代码审查"和"代码生成"在嵌入空间中可能高度相似，但Agent需要的是完全不同的技能。

基于KG的技能检索流程——任务、Skill
KG、匹配能力、生成Workflow——通过三种互补的匹配机制解决这一问题。图嵌入（Graph
Embedding）将技能图谱中的节点和关系编码为低维向量，在保留结构信息的同时支持语义搜索。子图同构匹配则用于复杂任务到多技能组合的精确对齐：当任务需要多个技能协同完成时，子图匹配可以在技能图谱中寻找与任务需求图结构最匹配的技能组合子图\[25\]。

Ding等人提出的SkillResolve-Bench专门评估了"同能力歧义"（same-capability
ambiguity）问题：当多个技能声称具有相同能力但因资源绑定、前置条件或执行流程不同而导致不同的执行结果时，检索器需要区分"能力家族"和"具体代表"。SkillResolve通过在同能力家族内进行条件评分和代表性选择，将Recall@3从0.654提升至0.766，同时将有害同胞率（HSR@3）从0.693降至0\[25\]。Zhao等人提出的SkillComposer则从技能组合的角度出发，将技能选择、数量和顺序作为一个联合决策问题，通过约束自回归解码器在单一解码过程中同时生成技能子集、计数和执行顺序，在GPT-5.2-Codex上将任务通过率提升了23.1个百分点\[26\]。

### 5.3 技能演化与自动生成

KG为技能演化提供了结构化的记忆和推理基础，使Agent能够从执行经验中自动发现、组合和优化技能，实现能力的持续增长。技能的静态预定义无法满足Agent在动态环境中的长期运行需求——新的任务类型会不断出现，已有的技能可能需要根据新场景进行调整，而某些技能组合可能被反复使用而值得被封装为新的复合技能。

KG在技能生命周期的持续演化中扮演三个关键角色。第一，技能挖掘（Skill
Mining）：从历史执行日志中自动发现新的技能模式。通过分析任务执行图中的频繁子图，Agent可以识别出被反复调用的操作序列，将其抽象为新的技能节点并添加到技能图谱中\[27\]。第二，技能自动组合（Skill
Composition）：GraSP（Graph-Structured Skill
Compositions）作为首个可执行的技能图架构，引入了技能检索和执行之间的编译层，将扁平技能集转化为带有前置条件-效果边的有向无环图（DAG），通过节点级验证和局部修复实现了技能组合的可靠执行\[23\]。在ALFWorld、ScienceWorld和WebShop等基准测试中，GraSP在所有配置下均优于ReAct、Reflexion和ExpeL等基线，在奖励指标上最高提升19个百分点，同时减少了41%的环境交互步骤。第三，增量技能学习：Lee等人提出的可检索技能增量学习框架通过持续任务适应机制，使Agent在新任务中逐步扩展技能库而不遗忘已有技能，在效率上显著优于从头训练的基线\[28\]。

## 6 知识图谱增强插件生态与代码智能

知识图谱在插件生态和代码智能中扮演双重角色：在插件层面，KG作为插件关系的语义索引实现智能发现与组合治理；在代码层面，KG将LSP的结构化信息提升为可推理的软件工程知识网络，使Agent能够从"代码理解"跨越到"软件知识推理"。本节按插件治理、代码图谱构建、代码推理的递进逻辑组织，从组件生态管理到代码语义理解形成互补的能力增强路径。

### 6.1 插件知识图谱与生态治理

插件知识图谱使Agent能够理解插件之间的语义关系而非仅依赖元数据标签，实现跨生态的智能插件发现和自动依赖解析。插件生态管理系统（如Claude
Code的Plugins、VS
Code的扩展市场）通常依赖元数据标签和关键词匹配来进行插件发现，这种方法在插件数量较少时可行，但随着生态规模的增长，关键词匹配的精度和召回率都会显著下降。

插件知识图谱通过将插件与任务、技能之间的关系形式化为语义关系边（supports、requires、extends），为插件发现提供了结构化推理能力。当Agent需要完成特定任务时，知识图谱可以通过图遍历找到所有支持该任务的插件链，同时自动解析依赖关系并检测兼容性约束\[29\]。这种方式的优势在于，它不依赖插件开发者提供的元数据标签的准确性，而是通过插件接口的语义分析自动构建关系。

在插件生态治理方面，KG为依赖管理、兼容性检测和版本控制提供了统一的图模型。插件依赖关系被建模为有向边，通过图遍历可以检测循环依赖和冲突依赖。兼容性检测利用图模式匹配来验证插件组合是否满足兼容性约束。版本管理则通过时间知识图谱追踪插件的演化历史，支持Agent在多个版本之间进行智能选择。Roychoudhury等人指出，随着AI驱动的软件开发工作流日益普及，可信的AI
Agent需要依赖可验证的软件生态治理机制，而KG正是实现这一目标的关键基础设施\[29\]。

### 6.2 软件工程知识图谱构建

SEKG将LSP的语法级代码理解提升为语义级的软件知识推理，使Agent能够理解代码实体之间的深层语义关系。LSP（Language
Server
Protocol）为代码Agent提供了语法级的代码结构信息——类定义、函数签名、变量类型、引用关系等——但这些信息本质上是对代码文本的结构化索引，而非对代码语义的理解。软件工程知识图谱（Software
Engineering Knowledge Graph,
SEKG）通过将LSP的结构化信息与版本历史、Bug报告和开发者信息融合，构建了可推理的软件知识网络\[30\]。

SEKG的节点类型包括代码实体（类、函数、API、模块、变量）和软件工程实体（Bug、Commit、Developer、Test
Case），关系类型则编码了调用关系、继承关系、修复关系和所有权关系。Liu等人提出的CodexGraph系统通过将LLM
Agent与代码图数据库接口集成，利用图数据库的结构属性和图查询语言的灵活性，实现了代码结构感知的精确上下文检索和代码导航\[31\]。在CrossCodeEval、SWE-bench和EvoCodeBench三个基准测试中，CodexGraph展示了统一的图数据库模式在学术和实际应用场景中的竞争力。

Huang等人通过语义增强的代码知识图谱揭示了智能合约代码复用中的隐含关系，其方法将从5,140个智能合约文件中提取的知识结构化，将代码推荐准确率提升了6%至45%，多样性提升了61%至102%\[32\]。Liang等人提出的KG4Py工具包则专注于Python代码知识图谱的自动生成和代码语义搜索，为代码Agent提供了可扩展的代码知识基础设施\[33\]。

### 6.3 KG增强的代码Agent推理与维护

KG驱动的代码Agent将程序的静态结构分析与动态演化历史统一为可推理的知识网络，支持从漏洞定位到修复方案生成的端到端推理。传统的代码Agent主要依赖LLM的代码理解能力，通过静态分析和测试反馈来定位和修复问题。然而，当问题涉及多个文件、跨模块调用链或历史引入的回归时，单纯的代码理解往往不足以追溯到问题的根源。

基于SEKG的代码Agent推理流程——漏洞、相关函数、调用链、测试文件、修改方案——通过图遍历来系统性地定位问题。当Agent检测到漏洞时，首先在SEKG中定位漏洞所在的代码实体节点，然后通过调用关系边向外遍历，找到所有可能受影响的函数和模块。Liu等人提出的MarsCode
Agent通过AI原生的自动Bug修复流程，将代码理解、根因分析和修复生成统一在SEKG的推理框架中\[34\]。Ma等人提出的Lingma
SWE-GPT则从开发过程的角度出发，构建了以开发流程为中心的语言模型，实现了与SEKG深度集成的自动化软件改进\[35\]。

在仓库级Agent方面，Phan等人提出的HyperAgent通过多智能体协作的方式解决大规模代码库中的编码任务，展示了Agent在仓库级代码理解和维护中的潜力\[36\]。Wang等人对SE领域中Agent技术的全面综述进一步确认了KG在代码Agent中的核心作用，并指出感知、记忆和行动三个模块是LLM驱动的SE
Agent的基本架构\[37\]。图
3展示了SEKG的三层架构设计，从数据层到知识图谱层再到Agent推理层形成结构化的代码推理流水线。

<figure>
<img src="https://cdn1.deepmd.net/static/img/d0824259generated-call_772aa8ba0e5b4ff18b9c1a85.png" style="width:85.0%" />
<figcaption>图 3. 软件工程知识图谱增强的代码Agent推理架构</figcaption>
</figure>

## 7 知识图谱增强工具调用与多智能体协作

知识图谱在工具调用和多智能体协作中提供统一的语义协调层：在工具层面，KG将MCP的工具连接能力升级为工具理解与自动编排能力；在多Agent层面，KG为Agent之间的能力发现、任务分配和协作规划提供结构化的语义基础。本节按工具语义增强、工具链规划、Agent协作、生态治理的递进逻辑组织，从单Agent工具调用到多Agent协同治理形成闭环的能力编排体系。

### 7.1 工具知识图谱与MCP语义增强

工具知识图谱为MCP的工具连接协议提供了缺失的语义理解层，使Agent能够基于工具的功能语义（而非仅接口签名）进行智能选择和组合。MCP（Model
Context
Protocol）是Anthropic提出的开放标准，旨在标准化LLM与外部工具之间的交互方式，通过tools、resources、prompts和sampling等原语建立结构化的交互层\[38\]。然而，MCP当前的设计侧重于工具连接的标准化，对工具的语义理解仍然依赖非结构化的文本描述，这限制了Agent在大量工具之间进行智能选择的能力。

工具知识图谱的节点类型包括Task（任务）、Tool（工具）、API（接口）、Parameter（参数）和DataSource（数据源），关系类型包括supports（支持任务）、requires（需要参数/数据源）、produces（产出的数据类型）和alternatives（替代工具）。这种结构化的语义描述使Agent能够基于功能语义而非仅基于名称匹配来选择工具\[39\]。Nizar等人提出的Agent-as-a-Graph方法将工具和Agent都表示为知识图谱中的节点和边，在检索时首先通过向量搜索找到相关Agent和工具节点，然后利用类型特定的加权倒数排序融合（wRRF）进行重排序，最后在图谱中遍历父Agent以获得最终的Agent集合。表
2对比了不同知识图谱增强方案在工具调用与多智能体协作场景中的核心机制和关键优势。在LiveMCPBenchmark上，该方法在Recall@5和nDCG@5上分别实现了14.9%和14.6%的提升\[39\]。

Ahmadi等人提出的MCP
Bridge通过轻量级RESTful代理有效解决了MCP在资源受限环境中的部署问题\[40\]。Tiang等人提出的RAG-MCP则通过检索增强生成机制缓解了LLM工具选择中的提示膨胀问题，使Agent能够在大量工具可用时仍保持高效的上下文利用\[41\]。Rose等人进一步将MCP与开放科学知识图谱连接，通过mcp-proto-okn实现了自然语言对科学知识图谱的访问，展示了MCP与KG融合在科学研究领域的应用潜力\[42\]。

### 7.2 MCP工具链自动规划

KG驱动的工具链规划将MCP的工具调用从单步API调用升级为可验证、可优化的多步工具组合执行方案。在复杂任务中，Agent通常需要调用多个工具并按特定顺序组合它们的输出，这要求Agent不仅知道每个工具的功能，还要理解工具之间的数据依赖关系——工具A的输出格式是否兼容工具B的输入要求，工具C是否可以替代工具B在特定条件下的角色。

基于图遍历的多步工具调用规划通过工具知识图谱中的关系边自动发现可行的工具链。当Agent需要完成复合任务时，规划算法在工具图谱中搜索从初始数据源到目标输出的所有路径，每条路径代表一个可能的工具链。然后，通过路径排序和约束验证，选择最优的工具链执行方案\[43\]。Parmar等人提出的工作流引擎通过将智能与执行分离，为MCP工具链提供了专门的执行环境，确保工具链的可靠执行和错误恢复\[43\]。

在工具链安全验证方面，基于KG的验证机制通过检查工具链中的每个步骤是否满足安全约束——如数据脱敏要求、访问权限限制和数据处理合规性——来确保工具链的安全性。Shiqing等人构建的MCPToolBench++为工具链规划提供了大规模基准测试，覆盖了多种工具组合场景下的性能和安全评估\[44\]。

### 7.3 Agent能力图谱与多智能体协作

Agent能力图谱将多Agent系统中的能力发现和协作规划建立在结构化的语义基础之上，支持从静态Agent团队到动态能力编配的演进。在多Agent系统中，将任务分配给最合适的Agent是协作效率的关键决定因素。传统方法通常依赖静态的Agent描述文本，当Agent能力发生变化时，这些描述会迅速过时，导致任务路由效率下降\[45\]。

Agent能力图谱的节点类型包括Agent、Skill、Task和Knowledge，关系类型包括can_handle（能处理）、collaborates_with（协作关系）和depends_on（依赖关系）。这种结构化表示支持基于图遍历的Subagent选择：当任务到来时，路由Agent在能力图谱中搜索所有标记为can_handle的Agent节点，并根据任务的复杂度和Agent的负载状态进行动态调度\[45\]。

Trombino等人提出的知识库感知编排（KBA
Orchestration）通过将静态Agent描述与从每个Agent内部知识库中提取的动态相关性信号进行增强，实现了更精确的任务路由。在该框架中，当静态描述不足以做出明确的决策时，编排器会并行提示各个子Agent，每个Agent评估任务与其私有知识库的相关性，返回轻量级的ACK信号而不暴露底层数据，这些信号被填充到共享语义缓存中，为未来的查询提供动态的Agent适用性指示\[45\]。实验表明，KBA编排在路由精度和系统效率上显著优于纯静态描述驱动的方法。

Zhang等人提出的OSC（Orchestrating Cognitive
Synergy）框架通过引入协作者知识模型（Collaborator Knowledge Models,
CKM），使每个Agent能够动态感知其协作者的认知状态，通过实时认知差距分析自适应调整通信行为，将"并行工作的个体"转变为"深度协作的认知团队"\[46\]。

### 7.4 MCP与多Agent生态的KG治理

KG为MCP和多Agent生态提供了统一的治理框架，使安全审计、依赖管理和组织结构优化能够在同一语义层上协同运作。随着MCP
Server数量的增长和多Agent系统的规模化，生态治理成为一个紧迫的问题。Yan等人揭示了MCP
Server中的隐私泄露风险，发现本地执行环境中的敏感信息可能通过工具调用被泄露到外部系统\[47\]。Hasan等人从安全性和可维护性角度对MCP
Server进行了系统研究\[48\]，Gaire等人则对MCP生态系统中的安全和安全问题进行了系统性知识梳理\[49\]。

在工具安全审计方面，基于KG的治理框架将每个MCP
Server的安全属性、权限要求和数据处理行为建模为图谱中的节点属性，通过图查询自动识别潜在的隐私泄露路径和不安全的工具组合。在Agent间通信协议验证方面，KG通过建模通信链路的拓扑结构和协议规范，支持对通信安全性的自动化验证。在组织结构优化方面，基于KG的Agent组织结构动态优化通过分析Agent之间的协作历史图谱，识别协作瓶颈并建议重组方案\[46\]。

表 2. 知识图谱增强工具调用与多智能体协作方案性能对比

| 方案              | 核心机制         | 适用场景      | 关键优势           | 参考文献 |
|:------------------|:-----------------|:--------------|:-------------------|:---------|
| Agent-as-a-Graph  | KG工具-Agent检索 | 大规模MCP生态 | 检索精度提升14.9%  | \[39\]   |
| KBA Orchestration | 动态KB相关性信号 | 动态能力路由  | 路由精度显著提升   | \[45\]   |
| OSC               | 协作者知识模型   | 深度协作推理  | 协作效率与质量提升 | \[46\]   |
| MCP Bridge        | RESTful代理      | 资源受限环境  | 跨平台兼容性       | \[40\]   |


## 8 挑战与未来方向

知识图谱增强Agent
Harness面临的核心挑战集中在"组件—语义—编排"框架的三个维度上：组件维度上各Harness模块的KG融合深度不均，语义维度上实时推理与规模扩展存在根本性张力，编排维度上自动化构建与跨领域泛化仍是开放问题。未来突破方向包括自演化知识图谱、联邦式Agent知识共享和面向Agent
OS的统一语义基础设施。本节按当前局限、自演化、联邦共享的递进逻辑组织，从问题诊断到解决方案形成对照式的挑战-应对分析框架。

### 8.1 各组件KG融合的当前局限

各Harness组件中KG融合的成熟度差异显著，技能和工具层面的融合进展较快，而事件控制和上下文管理层面仍面临实时性与规模化的根本性挑战。从"组件—语义—编排"三维框架逐一分析，七个Harness组件中KG融合的局限性呈现出清晰的差异化模式。

在上下文管理层面，知识时效性是核心挑战。动态知识图谱需要持续更新以反映最新的任务状态和环境变化，但高频更新会导致图结构的频繁重组，影响查询性能。Zep等时间知识图谱架构在知识演化管理方面取得了进展\[12\]，但在大规模知识图谱上的实时增量更新仍面临索引维护和一致性保证的工程挑战。此外，当前上下文KG的规模通常受到Agent上下文窗口的间接限制，因为检索到的子图必须适配上下文窗口的大小。

在事件控制层面，实时推理延迟是最突出的问题。基于KG的规则触发需要在每个Hook事件发生时执行图查询，而复杂规则可能涉及多跳图遍历，延迟会随着图谱规模的增大而增加。对于MCP工具调用前的安全检查等对延迟敏感的Hook，毫秒级的额外延迟可能显著影响用户体验\[1\]。

在技能系统层面，冷启动问题是主要瓶颈。新部署的Agent缺乏历史执行数据，无法构建有意义的技能知识图谱，导致初期的技能选择和组合效率低下。SRA-Bench的发现表明，即使技能检索达到了较高的精度，Agent在技能加载和利用方面仍存在显著不足\[24\]。跨领域泛化是另一项挑战：在特定领域构建的技能图谱在迁移到新领域时，节点和关系的语义往往需要重新定义。

在插件和代码层面，图构建自动化是核心瓶颈。插件知识图谱的构建需要从异构的插件元数据中自动抽取语义关系，但不同插件生态的元数据格式和完备性差异巨大，自动化的语义抽取仍面临准确率挑战。SEKG的构建则面临代码规模与图构建效率之间的权衡——大型代码仓库包含数百万个代码实体，全量图谱构建的计算成本极高\[2\]。

在工具和多Agent层面，协议标准化缺失是根本性障碍。虽然MCP为工具连接提供了标准化接口\[38\]，但工具知识图谱的语义表示仍缺乏统一的本体论标准，不同Agent系统可能使用不同的节点类型和关系定义，导致图谱之间的互操作性受限。同样，Agent能力图谱的构建依赖于Agent能力的标准化描述，而当前各Agent框架对能力描述的方式差异显著\[8\]。

### 8.2 自演化Agent知识图谱

自演化知识图谱是Agent实现真正自主性的关键基础设施，使Agent能够在使用过程中持续积累和优化知识，而非依赖静态的预构建图谱。当前的Agent知识图谱大多在系统部署前构建，运行期间主要进行查询和有限的更新，这种静态模式在两个维度上限制了Agent的自主性：Agent无法从自身的运行经验中学习新的知识结构，也无法适应任务分布和环境的变化。

自演化Agent知识图谱的核心能力包括三个方面。第一，从Agent执行日志中自动抽取知识：通过分析Agent的任务执行轨迹，自动识别出新的实体、关系和模式，并将其增量集成到现有图谱中。这个过程需要解决知识抽取的置信度评估、新知识与已有知识的冲突消解以及图谱结构的一致性维护等问题。第二，基于反馈的图谱质量自我改进：Agent在执行任务时会产生明确的成功/失败信号，这些信号可以作为知识图谱质量的反馈源，通过强化学习等方法优化图谱的拓扑结构和边权重\[50\]。第三，面向未知领域的知识图谱自主扩展：当Agent遇到图谱中不存在的实体或关系时，通过主动查询外部知识源（如Web搜索、文献数据库）来获取新知识并自主扩展图谱。

### 8.3 联邦式多Agent知识共享与Agent OS

面向Agent
OS的统一知识基础设施将知识图谱从单Agent的增强工具升级为多Agent生态的协作基础，推动Agent系统从孤立智能体向群体智能的演进。当前的多Agent系统在知识共享方面面临两个根本性障碍：各Agent维护的知识图谱在结构和语义上异构，缺乏统一的对齐机制；以及Agent之间的知识共享需要平衡信息透明度与隐私保护。

联邦式多Agent知识共享架构通过三个关键机制解决这些问题。跨Agent的知识图谱对齐与融合通过本体匹配和实体对齐技术，将不同Agent维护的异构知识图谱映射到共享的语义空间，使Agent能够理解其他Agent的知识结构而不需要暴露底层数据\[51\]。隐私保护的知识共享协议通过差分隐私和安全多方计算等技术，使Agent能够在不泄露原始数据的前提下共享知识统计信息，在知识利用和隐私保护之间取得平衡。

最终，将KG作为Agent操作系统的原生语义层是Agent OS愿景的核心。Agent
OS将Agent的生命周期管理（创建、调度、监控、销毁）、资源管理（计算、存储、网络）和知识管理（存储、检索、推理、共享）统一在操作系统的抽象层次上，而KG则作为知识管理的核心数据结构，为Agent
OS提供统一的语义基座。这一愿景的实现需要解决知识图谱在操作系统级别的性能、可靠性和安全性等系统工程挑战\[52\]。

## 9 结论

知识图谱正从Agent的外部知识源演进为Agent
Harness内部的统一语义层，"组件—语义—编排"三维分析框架揭示了KG在七个Harness组件中融合的差异化路径和共同挑战，未来Agent
OS级别的知识基础设施将是实现真正自主智能体的关键。

本文的核心贡献是提出了"组件—语义—编排"三维评估框架，并在此框架下系统梳理了知识图谱在Agent
Harness七个核心组件中的融合方案与增强效果。这一框架的独特价值在于，它将KG在Agent系统中的作用从被动的"外部知识源"重新定位为主动的"内部统一语义层"，从而为研究者和实践者提供了系统性的评估工具和设计指南。

在各组件中，KG融合的关键发现呈现出从底层到高层的递进增强模式。在上下文管理层面，KG实现了从静态文本配置到动态可推理知识上下文图谱的转变，使Agent能够理解配置项之间的语义关系并自动检测知识一致性。在事件驱动控制层面，事件知识图谱赋予了Hooks超越静态规则的语义决策能力，通过图遍历和子图匹配实现了上下文感知的动态规则触发。在技能系统层面，技能知识图谱将离散的技能列表升级为可推理、可组合的能力网络，GraSP等架构通过在检索和执行之间引入编译层，实现了技能组合的可靠执行。在工具调用层面，KG将MCP的工具连接能力升级为工具理解与自动编排能力，Agent-as-a-Graph等方法通过图结构检索实现了工具选择的精度提升。在多Agent协作层面，Agent能力图谱和KBA编排为任务路由和协作规划提供了动态的语义基础。

然而，当前的研究缺口同样显著。KG在Agent
Harness中的融合深度在各组件之间分布不均，技能和工具层面的融合方案相对成熟，而事件控制和上下文管理层面的实时推理与大规模知识管理之间的张力尚未解决。自动化图谱构建仍是跨组件的共同瓶颈，尤其是在插件生态和代码智能层面。此外，当前研究多集中于单Agent场景，多Agent场景下的知识共享、隐私保护和联邦式图谱管理仍处于早期探索阶段。

展望未来，三个方向值得重点关注。自演化知识图谱将使Agent能够在运行过程中持续积累和优化知识，实现从"被编程的知识"到"自生长的知识"的转变。联邦式多Agent知识共享将推动Agent系统从孤立智能体向群体智能的演进，而隐私保护的知识共享协议将是这一转变的关键使能技术。面向Agent
OS的统一知识基础设施将把KG从单Agent的增强工具升级为整个Agent生态的操作系统级语义基座，为下一代自主智能体系统提供统一的知识管理、推理和共享能力。

## 参考文献

<span class="csl-left-margin">\[1\]
</span><span class="csl-right-inline">L. Wang *et al.*,
"A Survey on Large Language Model based Autonomous
Agents," *arXiv-Artificial Intelligence*, 2023, doi:
[10.48550/arxiv.2308.11432](https://doi.org/10.48550/arxiv.2308.11432).</span>

<span class="csl-left-margin">\[2\]
</span><span class="csl-right-inline">J. Luo *et al.*,
"Large Language Model Agent: A Survey on
Methodology, Applications and Challenges," *arXiv-Computation and
Language*, 2025, doi:
[10.48550/arxiv.2503.21460](https://doi.org/10.48550/arxiv.2503.21460).</span>

<span class="csl-left-margin">\[3\]
</span><span class="csl-right-inline">Y. Wang *et al.*,
"Large Model Based Agents: State-of-the-Art,
Cooperation Paradigms, Security and Privacy, and Future Trends,"
*arXiv-Artificial Intelligence*, 2024, doi:
[10.48550/arxiv.2409.14457](https://doi.org/10.48550/arxiv.2409.14457).</span>

<span class="csl-left-margin">\[4\]
</span><span class="csl-right-inline">S. S. Chowa *et al.*,
"From Language to Action: A Review of Large
Language Models as Autonomous Agents and Tool Users,"
*arXiv-Computation and Language*, 2025, doi:
[10.48550/arxiv.2508.17281](https://doi.org/10.48550/arxiv.2508.17281).</span>

<span class="csl-left-margin">\[5\]
</span><span class="csl-right-inline">L. Liu, Z. Wang, and H. Tong,
"Neural-Symbolic Reasoning over Knowledge Graphs: A
Survey from a Query Perspective," *arXiv-Artificial
Intelligence*, 2024, doi:
[10.48550/arxiv.2412.10390](https://doi.org/10.48550/arxiv.2412.10390).</span>

<span class="csl-left-margin">\[6\]
</span><span class="csl-right-inline">M. G. Skjæveland, K. Balog, N.
Bernard, W. Łajewska, and T. Linjordet, "An
Ecosystem for Personal Knowledge Graphs: A Survey and Research
Roadmap," *arXiv-Artificial Intelligence*, 2023, doi:
[10.48550/arxiv.2304.09572](https://doi.org/10.48550/arxiv.2304.09572).</span>

<span class="csl-left-margin">\[7\]
</span><span class="csl-right-inline">S. Wang, H. Yang, and W. Liu,
"Research on the construction and application of
retrieval enhanced generation (RAG) model based on knowledge
graph," *Scientific Reports*, 2025, doi:
[10.1038/s41598-025-21222-z](https://doi.org/10.1038/s41598-025-21222-z).</span>

<span class="csl-left-margin">\[8\]
</span><span class="csl-right-inline">D. Bhati, F. Neha, D. S. Bandaru,
M. Weber, and I. D. Gajera, "Mapping the LLM
Landscape: A Cross-Family Survey of Architectures, Alignment Methods,
and Benchmark Performance," *AI*, 2026, doi:
[10.3390/ai7040142](https://doi.org/10.3390/ai7040142).</span>

<span class="csl-left-margin">\[9\]
</span><span class="csl-right-inline">J. Xu, M. Li, Y. Tang, P. Wang,
and W. Zhang, "Towards Open-World
Retrieval-Augmented Generation on Knowledge Graph: A Multi-Agent
Collaboration Framework," *Computer Science*, 2025, doi:
[10.48550/arxiv.2509.01238](https://doi.org/10.48550/arxiv.2509.01238).</span>

<span class="csl-left-margin">\[10\]
</span><span class="csl-right-inline">X. Zhao *et al.*,
"AGENTiGraph: An Interactive Knowledge Graph
Platform for LLM-based Chatbots Utilizing Private Data,"
*arXiv-Artificial Intelligence*, 2024, doi:
[10.48550/arxiv.2410.11531](https://doi.org/10.48550/arxiv.2410.11531).</span>

<span class="csl-left-margin">\[11\]
</span><span class="csl-right-inline">F. Ocker, J. Deigmöller, P.
Smirnov, and J. Eggert, "A Grounded Memory System For Smart Personal
Assistants," *Computer Science*, 2025, doi:
[10.48550/arxiv.2505.06328](https://doi.org/10.48550/arxiv.2505.06328).</span>

<span class="csl-left-margin">\[12\]
</span><span class="csl-right-inline">P. Rasmussen, P. Paliychuk, T.
Beauvais, J. Ryan, and D. Chalef, "Zep: A Temporal
Knowledge Graph Architecture for Agent Memory," *Computation and
Language*, 2025, doi:
[10.48550/arxiv.2501.13956](https://doi.org/10.48550/arxiv.2501.13956).</span>

<span class="csl-left-margin">\[13\]
</span><span class="csl-right-inline">J. Jang, T. Kim, and H. Kim,
"Mixed-Session Conversation with Egocentric
Memory," *arXiv-Computation and Language*, 2024, doi:
[10.48550/arxiv.2410.02503](https://doi.org/10.48550/arxiv.2410.02503).</span>

<span class="csl-left-margin">\[14\]
</span><span class="csl-right-inline">M. Hofmeister *et al.*,
"Semantic agent framework for automated flood
assessment using dynamic knowledge graphs," *Data-Centric
Engineering*, 2024, doi:
[10.1017/dce.2024.11](https://doi.org/10.1017/dce.2024.11).</span>

<span class="csl-left-margin">\[15\]
</span><span class="csl-right-inline">T. Wang, G. Qi, and T. Wu,
"KGroot: Enhancing Root Cause Analysis through
Knowledge Graphs and Graph Convolutional Neural Networks,"
*arXiv-Artificial Intelligence*, 2024, doi:
[10.48550/arxiv.2402.13264](https://doi.org/10.48550/arxiv.2402.13264).</span>

<span class="csl-left-margin">\[16\]
</span><span class="csl-right-inline">J. Bai, K. F. Lee, M. Hofmeister,
S. Mosbach, J. Akroyd, and M. Kraft, "A derived
information framework for a dynamic knowledge graph and its application
to smart cities," *Future Generation Computer Systems*, 2024,
doi:
[10.1016/j.future.2023.10.008](https://doi.org/10.1016/j.future.2023.10.008).</span>

<span class="csl-left-margin">\[17\]
</span><span class="csl-right-inline">H. Nakagawa, S. Tsuchida, E.
Tramontana, A. Fornaia, and T. Tsuchiya, "Embedded
System Evolution in IoT System Development Based on MAPE-K Loop
Mechanism," *arXiv-Software Engineering*, 2022, doi:
[10.48550/arxiv.2205.13375](https://doi.org/10.48550/arxiv.2205.13375).</span>

<span class="csl-left-margin">\[18\]
</span><span class="csl-right-inline">A. Berti, U. Jessen, G. Park, M.
Rafiei, and W. M. P. van der Aalst, "Analyzing
interconnected processes: using object-centric process mining to analyze
procurement processes," *International Journal of Data Science
and Analytics*, 2023, doi:
[10.1007/s41060-023-00427-3](https://doi.org/10.1007/s41060-023-00427-3).</span>

<span class="csl-left-margin">\[19\]
</span><span class="csl-right-inline">M. Yang, Y. Yang, and P. Jiang,
"A design method for edge--cloud collaborative
product service system: a dynamic event-state knowledge graph-based
approach with real case study," *International Journal of
Production Research*, 2024, doi:
[10.1080/00207543.2023.2219345](https://doi.org/10.1080/00207543.2023.2219345).</span>

<span class="csl-left-margin">\[20\]
</span><span class="csl-right-inline">S. Caldwell *et al.*,
"An Agile New Research Framework for Hybrid
Human-AI Teaming: Trust, Transparency, and Transferability," *ACM
Transactions on Interactive Intelligent Systems*, 2022, doi:
[10.1145/3514257](https://doi.org/10.1145/3514257).</span>

<span class="csl-left-margin">\[21\]
</span><span class="csl-right-inline">R. Walid, K. P. Joshi, and S. G.
Choi, "Leveraging semantic context to establish
access controls for secure cloud-based electronic health
records," *International Journal of Information Management Data
Insights*, 2024, doi:
[10.1016/j.jjimei.2023.100211](https://doi.org/10.1016/j.jjimei.2023.100211).</span>

<span class="csl-left-margin">\[22\]
</span><span class="csl-right-inline">G. Lanzola *et al.*,
"The Case Manager: An Agent Controlling the
Activation of Knowledge Sources in a FHIR-Based Distributed Reasoning
Environment," *Applied Clinical Informatics*, 2023, doi:
[10.1055/a-2113-4443](https://doi.org/10.1055/a-2113-4443).</span>

<span class="csl-left-margin">\[23\]
</span><span class="csl-right-inline">T. Xia *et al.*,
"GraSP: Graph-Structured Skill Compositions for LLM
Agents," *arXiv-Computation and Language*, 2026, doi:
[10.48550/arxiv.2604.17870](https://doi.org/10.48550/arxiv.2604.17870).</span>

<span class="csl-left-margin">\[24\]
</span><span class="csl-right-inline">W. Su *et al.*,
"Skill Retrieval Augmentation for Agentic
AI," *arXiv-Computation and Language*, 2026, doi:
[10.48550/arxiv.2604.24594](https://doi.org/10.48550/arxiv.2604.24594).</span>

<span class="csl-left-margin">\[25\]
</span><span class="csl-right-inline">J. Ding,
"SkillResolve-Bench: Measuring and Resolving
Same-Capability Ambiguity in Agent Skill Retrieval,"
*arXiv-Artificial Intelligence*, 2026, doi:
[10.48550/arxiv.2606.10388](https://doi.org/10.48550/arxiv.2606.10388).</span>

<span class="csl-left-margin">\[26\]
</span><span class="csl-right-inline">X. Zhao *et al.*,
"Generative Skill Composition for LLM
Agents," *arXiv-Computation and Language*, 2026, doi:
[10.48550/arxiv.2606.32025](https://doi.org/10.48550/arxiv.2606.32025).</span>

<span class="csl-left-margin">\[27\]
</span><span class="csl-right-inline">A. C. Redis, M. F. Sani, B.
Zarrin, and A. Burattin, "Skill Learning Using
Process Mining for Large Language Model Plan Generation,"
*arXiv-Computation and Language*, 2024, doi:
[10.48550/arxiv.2410.12870](https://doi.org/10.48550/arxiv.2410.12870).</span>

<span class="csl-left-margin">\[28\]
</span><span class="csl-right-inline">D. Lee, M. Yoo, W. K. Kim, W.
Choi, and H. Woo, "Incremental Learning of
Retrievable Skills For Efficient Continual Task Adaptation,"
*arXiv-Machine Learning*, 2024, doi:
[10.48550/arxiv.2410.22658](https://doi.org/10.48550/arxiv.2410.22658).</span>

<span class="csl-left-margin">\[29\]
</span><span class="csl-right-inline">A. Roychoudhury,
"Agentic AI for Software: thoughts from Software
Engineering community," *arXiv-Software Engineering*, 2025, doi:
[10.48550/arxiv.2508.17343](https://doi.org/10.48550/arxiv.2508.17343).</span>

<span class="csl-left-margin">\[30\]
</span><span class="csl-right-inline">L. Wang, C. Sun, C. Zhang, W. Nie,
and K. Huang, "Application of knowledge graph in
software engineering field: A systematic literature review,"
*Information and Software Technology*, 2023, doi:
[10.1016/j.infsof.2023.107327](https://doi.org/10.1016/j.infsof.2023.107327).</span>

<span class="csl-left-margin">\[31\]
</span><span class="csl-right-inline">X. Liu *et al.*,
"CodexGraph: Bridging Large Language Models and
Code Repositories via Code Graph Databases," *arXiv-Software
Engineering*, 2024, doi:
[10.48550/arxiv.2408.03910](https://doi.org/10.48550/arxiv.2408.03910).</span>

<span class="csl-left-margin">\[32\]
</span><span class="csl-right-inline">Q. Huang, D. Liao, Z. Xing, Z.
Zuo, C. Wang, and X. Xia, "Semantic-Enriched Code
Knowledge Graph to Reveal Unknowns in Smart Contract Code Reuse,"
*ACM Transactions on Software Engineering and Methodology*, 2023, doi:
[10.1145/3597206](https://doi.org/10.1145/3597206).</span>

<span class="csl-left-margin">\[33\]
</span><span class="csl-right-inline">L. Liang, Y. Li, M. Wen, and Y.
Liu, "KG4Py: A toolkit for generating Python
knowledge graph and code semantic search," *Connection Science*,
2022, doi:
[10.1080/09540091.2022.2072471](https://doi.org/10.1080/09540091.2022.2072471).</span>

<span class="csl-left-margin">\[34\]
</span><span class="csl-right-inline">Y. Liu *et al.*,
"MarsCode Agent: AI-native Automated Bug
Fixing," *arXiv-Software Engineering*, 2024, doi:
[10.48550/arxiv.2409.00899](https://doi.org/10.48550/arxiv.2409.00899).</span>

<span class="csl-left-margin">\[35\]
</span><span class="csl-right-inline">Y. Ma *et al.*,
"Lingma SWE-GPT: An Open
Development-Process-Centric Language Model for Automated Software
Improvement," *arXiv-Software Engineering*, 2024, doi:
[10.48550/arxiv.2411.00622](https://doi.org/10.48550/arxiv.2411.00622).</span>

<span class="csl-left-margin">\[36\]
</span><span class="csl-right-inline">H. N. Phan, T. N. Nguyen, P. X.
Nguyen, and N. D. Q. Bui, "HyperAgent: Generalist
Software Engineering Agents to Solve Coding Tasks at Scale,"
*arXiv-Software Engineering*, 2024, doi:
[10.48550/arxiv.2409.16299](https://doi.org/10.48550/arxiv.2409.16299).</span>

<span class="csl-left-margin">\[37\]
</span><span class="csl-right-inline">Y. Wang *et al.*,
"Agents in Software Engineering: Survey, Landscape,
and Vision," *arXiv-Software Engineering*, 2024, doi:
[10.48550/arxiv.2409.09030](https://doi.org/10.48550/arxiv.2409.09030).</span>

<span class="csl-left-margin">\[38\]
</span><span class="csl-right-inline">V. Ayyagari,
"Model Context Protocol for Agentic AI: Enabling
Contextual Interoperability Across Systems," *International
Journal of Computational and Experimental Science and Engineering*,
2025, doi:
[10.22399/ijcesen.3678](https://doi.org/10.22399/ijcesen.3678).</span>

<span class="csl-left-margin">\[39\]
</span><span class="csl-right-inline">F. Nizar, E. Lumer, A. Gulati, P.
H. Basavaraju, and V. K. Subbiah,
"Agent-as-a-Graph: Knowledge Graph-Based Tool and
Agent Retrieval for LLM Multi-Agent Systems," *arXiv-Computation
and Language*, 2025, doi:
[10.48550/arxiv.2511.18194](https://doi.org/10.48550/arxiv.2511.18194).</span>

<span class="csl-left-margin">\[40\]
</span><span class="csl-right-inline">A. Ahmadi, S. Sharif, and Y. M.
Banad, "MCP Bridge: A Lightweight, LLM-Agnostic
RESTful Proxy for Model Context Protocol Servers,"
*arXiv-Cryptography and Security*, 2025, doi:
[10.48550/arxiv.2504.08999](https://doi.org/10.48550/arxiv.2504.08999).</span>

<span class="csl-left-margin">\[41\]
</span><span class="csl-right-inline">T. Gan and Q. Sun,
"RAG-MCP: Mitigating Prompt Bloat in LLM Tool
Selection via Retrieval-Augmented Generation," *arXiv-Artificial
Intelligence*, 2025, doi:
[10.48550/arxiv.2505.03275](https://doi.org/10.48550/arxiv.2505.03275).</span>

<span class="csl-left-margin">\[42\]
</span><span class="csl-right-inline">P. W. Rose *et al.*,
"mcp-proto-okn: Natural-language access to open
scientific knowledge graphs through the Model Context Protocol,"
*arXiv-Artificial Intelligence*, 2026, doi:
[10.48550/arxiv.2605.30283](https://doi.org/10.48550/arxiv.2605.30283).</span>

<span class="csl-left-margin">\[43\]
</span><span class="csl-right-inline">A. S. Parmar,
"Separating Intelligence from Execution: A Workflow
Engine for the Model Context Protocol," *arXiv-Distributed,
Parallel, and Cluster Computing*, 2026, doi:
[10.48550/arxiv.2605.00827](https://doi.org/10.48550/arxiv.2605.00827).</span>

<span class="csl-left-margin">\[44\]
</span><span class="csl-right-inline">S. Fan, X. Ding, L. Zhang, and L.
Mo, "MCPToolBench++: A Large Scale AI Agent Model Context Protocol MCP
Tool Use Benchmark," *arXiv-Artificial Intelligence*, 2025, doi:
[10.48550/arxiv.2508.07575](https://doi.org/10.48550/arxiv.2508.07575).</span>

<span class="csl-left-margin">\[45\]
</span><span class="csl-right-inline">D. Trombino, V. Pecorella, A. de
Giulii, and D. Tresoldi, "Knowledge Base-Aware
Orchestration: A Dynamic, Privacy-Preserving Method for Multi-Agent
Systems," *arXiv-Multiagent Systems*, 2025, doi:
[10.48550/arxiv.2509.19599](https://doi.org/10.48550/arxiv.2509.19599).</span>

<span class="csl-left-margin">\[46\]
</span><span class="csl-right-inline">J. Zhang, Y. Fan, K. Cai, X. Sun,
and K. Wang, "OSC: Cognitive Orchestration through
Dynamic Knowledge Alignment in Multi-Agent LLM Collaboration,"
*arXiv-Artificial Intelligence*, 2025, doi:
[10.48550/arxiv.2509.04876](https://doi.org/10.48550/arxiv.2509.04876).</span>

<span class="csl-left-margin">\[47\]
</span><span class="csl-right-inline">B. Yan *et al.*,
""What Happens Locally, Leaks Globally": Detecting
Privacy Leakage Risks in MCP Servers," *arXiv-Cryptography and
Security*, 2026, doi:
[10.48550/arxiv.2606.21338](https://doi.org/10.48550/arxiv.2606.21338).</span>

<span class="csl-left-margin">\[48\]
</span><span class="csl-right-inline">M. M. Hasan, H. Li, E.
Fallahzadeh, B. Adams, and A. E. Hassan, "Model
Context Protocol (MCP) at First Glance: Studying the Security and
Maintainability of MCP Servers," *arXiv-Emerging Technologies*,
2025, doi:
[10.48550/arxiv.2506.13538](https://doi.org/10.48550/arxiv.2506.13538).</span>

<span class="csl-left-margin">\[49\]
</span><span class="csl-right-inline">S. Gaire, S. Gyawali, S. Mishra,
S. Niroula, D. Thakur, and U. Yadav,
"Systematization of Knowledge: Security and Safety
in the Model Context Protocol Ecosystem," *arXiv-Cryptography and
Security*, 2025, doi:
[10.48550/arxiv.2512.08290](https://doi.org/10.48550/arxiv.2512.08290).</span>

<span class="csl-left-margin">\[50\]
</span><span class="csl-right-inline">J. Guo, X. Zhang, K. Liang, and G.
Zhang, "Memory-Enhanced Knowledge Reasoning with
Reinforcement Learning," *Applied Sciences (Switzerland)*, 2024,
doi: [10.3390/app14073133](https://doi.org/10.3390/app14073133).</span>

<span class="csl-left-margin">\[51\]
</span><span class="csl-right-inline">S. T. Erukude, S. R. Veluru, and
V. C. Marella, "AGENTIC AI - THE RISE OF AUTONOMOUS INTELLIGENT AGENTS
IN THE ERA OF LLMS," *Indian Journal of Computer Science and
Engineering*, 2025, doi:
[10.21817/indjcse/2025/v16i1/251602024](https://doi.org/10.21817/indjcse/2025/v16i1/251602024).</span>

<span class="csl-left-margin">\[52\]
</span><span class="csl-right-inline">S. M. S. Mohammadabadi, B. C.
Kara, C. Eyupoglu, C. Uzay, M. S. Tosun, and O. Karakuş,
"A Survey of Large Language Models: Evolution,
Architectures, Adaptation, Benchmarking, Applications, Challenges, and
Societal Implications," *Electronics*, 2025, doi:
[10.3390/electronics14183580](https://doi.org/10.3390/electronics14183580).</span>
