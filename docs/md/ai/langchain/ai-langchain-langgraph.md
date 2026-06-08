---
title: LangChain - LangGraph 与状态机
category:
  - AI
  - LangChain
tag:
  - LangChain
---

> 原文链接：[掘金](https://juejin.cn/post/7628893548473270308)

## 14.1 为什么需要 LangGraph？

### 14.1.1 基础 Agent 的核心局限性

基础 Agent（如 Zero-shot ReAct）在面对复杂流程时存在 4 个难以解决的问题：

- **流程不可控**：执行流程完全依赖 LLM 的推理，开发者无法精确定义"先执行A，再执行B，失败则执行C"的固定流程
- **缺乏状态管理**：无法保存任务执行过程中的中间状态（如调研结果、撰写草稿），每次工具调用后中间数据难以复用
- **多 Agent 协作困难**：基础 Agent 是"单智能体"模式，无法实现"调研 Agent + 写作 Agent + 校对 Agent"的多角色协同
- **循环与分支逻辑薄弱**：难以实现复杂的分支决策（如"校对通过则结束，不通过则返回修改"）和循环控制

### 14.1.2 LangGraph 的核心优势

- **流程精准可控**：开发者可手动定义执行节点和流转关系，实现"固定流程+条件分支"的结构化管控
- **内置状态管理**：通过"状态（State）"统一管理中间数据，所有节点可共享、修改状态
- **原生支持多 Agent 协作**：可将不同功能的 Agent 作为独立节点，定义协作规则
- **灵活的循环与分支**：通过"条件边（Conditional Edges）"实现分支决策和循环控制
- **可视化执行路径**：可通过 LangSmith 或内置工具可视化 DAG 图和执行过程

### 14.1.3 适用场景

当你遇到以下场景时，优先使用 LangGraph 替代基础 Agent：

- 复杂流程管控（如"调研→撰写→校对→发布"的内容生产流程）
- 多 Agent 协作（如"数据采集 Agent + 分析 Agent + 可视化 Agent"）
- 需要精准状态管理（如保存中间结果、复用历史数据）
- 需要复杂分支与循环（如"失败重试、条件判断"）

## 14.2 状态（State）与节点（Node）概念

### 14.2.1 状态（State）：整个工作流的数据中心

状态（State）是 LangGraph 中存储所有中间数据和结果的容器，相当于整个工作流的"数据中心"。所有节点的输入、输出都会通过状态进行传递和共享。

**核心特点**：

- **可自定义结构**：根据任务需求，定义状态包含的字段
- **可修改、可共享**：每个节点都可以读取和修改状态中的字段
- **持久化（可选）**：可结合数据库，将状态持久化，避免任务中断后数据丢失

**定义状态的两种方式**：

LangGraph 支持两种定义状态的方式，新手推荐使用 Pydantic（结构化、带校验），进阶使用 TypedDict（更灵活）。

```python
from pydantic import BaseModel, Field

# 方式1：用 Pydantic 定义状态，结构化且支持参数校验
class WritingState(BaseModel):
    """写作 Agent 的状态定义"""
    topic: str = Field(description="写作主题")
    research_data: str = Field(default="", description="调研得到的资料")
    draft: str = Field(default="", description="撰写的文章草稿")
    review_comment: str = Field(default="", description="校对意见")
    is_approved: bool = Field(default=False, description="校对是否通过")
```

```python
from typing import TypedDict

# 方式2：用 TypedDict 定义状态，无校验，更灵活
class WritingState(TypedDict):
    topic: str
    research_data: str
    draft: str
    review_comment: str
    is_approved: bool
```

### 14.2.2 节点（Node）：工作流的执行单元

节点（Node）是 LangGraph 中执行具体逻辑的最小单元，相当于工作流的"执行步骤"。每个节点接收状态作为输入，执行逻辑后返回修改后的状态。

**核心特点**：

- **独立逻辑**：每个节点的逻辑独立，可单独开发、测试、复用
- **输入输出**：输入是当前状态，输出是修改后的状态
- **类型灵活**：节点可以是普通函数、LangChain Chain、Agent，甚至是另一个 LangGraph

**定义节点的基础示例**：

```python
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

# 1. 调研节点：根据主题获取调研资料
def research_node(state: WritingState) -> WritingState:
    prompt = f"围绕主题「{state['topic']}」，收集3条核心调研资料，每条不超过50字，简洁准确。"
    research_data = llm.invoke(prompt).content
    return {**state, "research_data": research_data}

# 2. 撰写节点：根据调研资料撰写草稿
def write_node(state: WritingState) -> WritingState:
    prompt = f"根据调研资料：{state['research_data']}，撰写一篇300字左右的文章，贴合主题，逻辑清晰。"
    draft = llm.invoke(prompt).content
    return {**state, "draft": draft}

# 3. 校对节点：校对草稿，更新审核意见和通过状态
def review_node(state: WritingState) -> WritingState:
    prompt = f"校对文章草稿：{state['draft']}，检查语法错误、逻辑连贯性，给出修改意见；若无误，返回'通过'，并标记is_approved为True。"
    comment = llm.invoke(prompt).content
    is_approved = "通过" in comment
    return {**state, "review_comment": comment, "is_approved": is_approved}
```

### 14.2.3 状态与节点的关系（极简图例）

```
初始状态 → 节点1（读取状态→执行逻辑→修改状态）→ 节点2（读取更新后状态→执行逻辑→再次修改）→ ... → 最终状态
```

核心逻辑：节点是"执行者"，状态是"数据载体"，节点通过修改状态，实现数据在工作流中的传递和更新。

## 14.3 构建有向无环图（DAG）工作流

LangGraph 的工作流基于**有向无环图（DAG）**构建——节点作为图的"顶点"，节点间的流转关系作为图的"边（Edge）"，且边的方向固定、无循环。

### 14.3.1 前置准备：安装 LangGraph

```bash
pip install langgraph langchain openai python-dotenv
```

### 14.3.2 核心构建步骤

构建 LangGraph DAG 工作流分为 3 步：

1. **定义状态（State）**：确定工作流需要存储的数据字段
2. **定义节点（Node）**：实现每个步骤的执行逻辑
3. **创建图（Graph）**：添加节点，定义流转关系（边），指定起始节点和结束节点

### 14.3.3 实战：构建"调研→撰写→校对"基础 DAG 工作流

```python
from langgraph.graph import Graph, END  # END 是内置的结束节点
from typing import TypedDict

# 1. 定义状态
class WritingState(TypedDict):
    topic: str
    research_data: str
    draft: str
    review_comment: str
    is_approved: bool

# 2. 初始化 LLM
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os
load_dotenv()
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

# 3. 定义节点
def research_node(state: WritingState) -> WritingState:
    prompt = f"围绕「{state['topic']}」，收集3条核心调研资料，简洁准确。"
    research_data = llm.invoke(prompt).content
    return {**state, "research_data": research_data}

def write_node(state: WritingState) -> WritingState:
    prompt = f"根据调研资料：{state['research_data']}，撰写300字左右文章，逻辑清晰。"
    draft = llm.invoke(prompt).content
    return {**state, "draft": draft}

def review_node(state: WritingState) -> WritingState:
    prompt = f"校对草稿：{state['draft']}，检查语法和逻辑，给出修改意见；无误则返回'通过'。"
    comment = llm.invoke(prompt).content
    return {**state, "review_comment": comment, "is_approved": "通过" in comment}

# 4. 构建 DAG 图
# 4.1 初始化图，指定状态类型
graph = Graph(state_schema=WritingState)

# 4.2 添加节点
graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("review", review_node)

# 4.3 定义节点流转关系（边）
graph.add_edge("research", "write")   # 调研完成后，进入撰写
graph.add_edge("write", "review")     # 撰写完成后，进入校对
graph.add_edge("review", END)         # 校对完成后，结束工作流

# 4.4 指定起始节点
graph.set_entry_point("research")

# 5. 编译图
app = graph.compile()

# 6. 执行工作流
initial_state = {
    "topic": "LangChain LangGraph 核心用法",
    "research_data": "",
    "draft": "",
    "review_comment": "",
    "is_approved": False
}

final_state = app.invoke(initial_state)

# 打印结果
print("=== 工作流执行完成 ===")
print(f"调研资料：{final_state['research_data']}")
print(f"\n文章草稿：{final_state['draft']}")
print(f"\n校对意见：{final_state['review_comment']}")
print(f"\n校对是否通过：{final_state['is_approved']}")
```

### 14.3.4 核心代码解析

- `Graph(state_schema=WritingState)`：初始化图，指定状态类型
- `add_node(name, func)`：添加节点，name 是唯一标识，func 是执行逻辑
- `add_edge(from_node, to_node)`：定义边（流转关系）
- `set_entry_point(node_name)`：指定起始节点
- `graph.compile()`：编译图，生成可执行的工作流实例
- `app.invoke(initial_state)`：执行工作流，传入初始状态，返回最终状态

### 14.3.5 DAG 工作流的核心特点

- **无环**：节点间的流转不会回到之前的节点，避免死循环
- **固定顺序**：严格按照"调研→撰写→校对"执行，流程可控
- **状态共享**：每个节点都能读取上一个节点更新后的状态，数据传递流畅

## 14.4 条件边（Conditional Edges）实现决策分支

在实际业务场景中，往往需要根据条件判断选择不同的执行路径——比如"校对通过则结束，不通过则返回修改"。这种分支逻辑需要通过 LangGraph 的**条件边（Conditional Edges）**实现。

### 14.4.1 条件边的定义方式

条件边通过 `add_conditional_edges` 方法定义，核心参数：

- **start_node**：当前节点（条件判断的触发节点）
- **condition**：条件判断函数，接收当前状态，返回下一个节点的名称（或 END）
- **mapping**：可选参数，将条件判断结果映射到具体节点

### 14.4.2 实战：给写作工作流添加条件分支

基于线性工作流，添加条件分支：校对节点执行后，判断 `is_approved`：

- 若通过（`is_approved=True`）：执行结束（END）
- 若不通过（`is_approved=False`）：返回撰写节点，重新修改草稿

```python
from langgraph.graph import Graph, END
from typing import TypedDict

# 1. 定义状态
class WritingState(TypedDict):
    topic: str
    research_data: str
    draft: str
    review_comment: str
    is_approved: bool

# 2. 初始化 LLM 和节点（复用之前的代码）
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os
load_dotenv()
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

def research_node(state: WritingState) -> WritingState:
    prompt = f"围绕「{state['topic']}」，收集3条核心调研资料，简洁准确。"
    research_data = llm.invoke(prompt).content
    return {**state, "research_data": research_data}

def write_node(state: WritingState) -> WritingState:
    prompt = f"根据调研资料：{state['research_data']}，结合校对意见：{state['review_comment']}，撰写300字左右文章，逻辑清晰。"
    draft = llm.invoke(prompt).content
    return {**state, "draft": draft}

def review_node(state: WritingState) -> WritingState:
    prompt = f"校对草稿：{state['draft']}，检查语法和逻辑，给出修改意见；无误则返回'通过'。"
    comment = llm.invoke(prompt).content
    return {**state, "review_comment": comment, "is_approved": "通过" in comment}

# 3. 构建带条件分支的 DAG 图
graph = Graph(state_schema=WritingState)

graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("review", review_node)

# 线性边
graph.add_edge("research", "write")
graph.add_edge("write", "review")

# 3.3 定义条件边
def review_condition(state: WritingState) -> str:
    """条件判断函数：根据 is_approved 决定下一个节点"""
    if state["is_approved"]:
        return END       # 校对通过，结束
    else:
        return "write"   # 校对不通过，返回撰写节点修改

# 添加条件边：从 review 节点出发
graph.add_conditional_edges(
    start_node="review",
    condition=review_condition
)

graph.set_entry_point("research")

# 4. 编译并执行
app = graph.compile()

initial_state = {
    "topic": "LangChain LangGraph 核心用法",
    "research_data": "",
    "draft": "",
    "review_comment": "首次撰写，无修改意见",
    "is_approved": False
}

final_state = app.invoke(initial_state)

print("=== 工作流执行完成 ===")
print(f"最终草稿：{final_state['draft']}")
print(f"\n最终校对意见：{final_state['review_comment']}")
print(f"\n校对是否通过：{final_state['is_approved']}")
```

### 14.4.3 关键代码解析

- **`review_condition`**：条件判断函数，接收当前状态，返回下一个节点的名称（或 END），是条件边的核心
- **`add_conditional_edges`**：将条件判断函数与节点关联，实现分支逻辑
- **循环逻辑**：当校对不通过时，返回撰写节点重新修改，再次进入校对节点，直到校对通过

### 14.4.4 简化条件边（使用 mapping 参数）

如果条件判断逻辑简单（如布尔值分支），可以使用 `mapping` 参数简化：

```python
# 简化条件边：用 mapping 映射条件结果
graph.add_conditional_edges(
    start_node="review",
    condition=lambda state: state["is_approved"],
    mapping={True: END, False: "write"}
)
```

## 14.5 多 Agent 协作架构

### 14.5.1 多 Agent 协作的常见架构

#### 架构1：流水线架构（适合简单协作）

每个 Agent 负责一个环节，按顺序执行：

```
调研 Agent → 写作 Agent → 校对 Agent → END
```

适用场景：任务流程固定，每个 Agent 的任务独立。

#### 架构2：决策-执行架构（适合复杂协作）

设置一个"决策 Agent"作为核心节点，负责分配任务；其他"执行 Agent"负责具体任务：

```
决策 Agent → 调研 Agent → 决策 Agent → 写作 Agent → 决策 Agent → 校对 Agent → END
```

适用场景：任务复杂、流程多变，需要根据执行结果动态调整。

### 14.5.2 实战：多 Agent 协作的写作工作流

采用"流水线架构"，实现 3 个 Agent 协作：

```python
from langgraph.graph import Graph, END
from typing import TypedDict
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from dotenv import load_dotenv
import os

load_dotenv()
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

# 1. 定义状态（共享多 Agent 数据）
class WritingState(TypedDict):
    topic: str
    research_data: str   # 调研 Agent 的输出
    draft: str           # 写作 Agent 的输出
    review_comment: str  # 校对 Agent 的输出
    is_approved: bool

# 2. 定义3个独立的 Agent
## 2.1 调研 Agent
def research_agent(state: WritingState) -> WritingState:
    prompt = f"作为调研 Agent，围绕「{state['topic']}」，收集3条核心调研资料，每条不超过50字，简洁准确。"
    research_data = llm.invoke(prompt).content
    return {**state, "research_data": research_data}

## 2.2 写作 Agent
def writing_agent(state: WritingState) -> WritingState:
    prompt = f"作为写作 Agent，根据调研资料：{state['research_data']}，撰写300字左右文章，贴合主题，逻辑清晰，语言流畅。"
    draft = llm.invoke(prompt).content
    return {**state, "draft": draft}

## 2.3 校对 Agent
def review_agent(state: WritingState) -> WritingState:
    prompt = f"作为校对 Agent，校对文章草稿：{state['draft']}，检查语法错误、逻辑连贯性、用词准确性，给出具体修改意见；若无误，返回'通过'。"
    comment = llm.invoke(prompt).content
    return {**state, "review_comment": comment, "is_approved": "通过" in comment}

# 3. 构建多 Agent 协作 DAG（流水线架构）
graph = Graph(state_schema=WritingState)

graph.add_node("research_agent", research_agent)
graph.add_node("writing_agent", writing_agent)
graph.add_node("review_agent", review_agent)

# 定义协作流程 + 条件分支
graph.add_edge("research_agent", "writing_agent")
graph.add_edge("writing_agent", "review_agent")
graph.add_conditional_edges(
    start_node="review_agent",
    condition=lambda state: state["is_approved"],
    mapping={True: END, False: "writing_agent"}
)

graph.set_entry_point("research_agent")

# 4. 编译并执行
app = graph.compile()

initial_state = {
    "topic": "LangChain LangGraph 多 Agent 协作",
    "research_data": "",
    "draft": "",
    "review_comment": "首次撰写，无修改意见",
    "is_approved": False
}

final_state = app.invoke(initial_state)

print("=== 多 Agent 协作完成 ===")
print(f"调研 Agent 输出：{final_state['research_data']}")
print(f"\n写作 Agent 输出：{final_state['draft']}")
print(f"\n校对 Agent 输出：{final_state['review_comment']}")
print(f"\n最终是否通过：{final_state['is_approved']}")
```

### 14.5.3 进阶：给 Agent 添加工具

实际场景中，Agent 往往需要调用工具。给调研 Agent 添加 DuckDuckGo 搜索引擎工具：

```python
# pip install duckduckgo-search
from langchain.tools import DuckDuckGoSearchRun

search_tool = DuckDuckGoSearchRun()

def research_agent_with_tool(state: WritingState) -> WritingState:
    research_agent = initialize_agent(
        tools=[search_tool],
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=False
    )
    prompt = f"围绕「{state['topic']}」，收集3条最新的核心调研资料，每条不超过50字，需通过搜索引擎获取实时信息。"
    research_data = research_agent.run(prompt)
    return {**state, "research_data": research_data}

graph.add_node("research_agent", research_agent_with_tool)
```

### 14.5.4 多 Agent 协作的核心优势

- **分工明确**：每个 Agent 专注于自己擅长的任务，提升效率和质量
- **可扩展性强**：可随时添加新的 Agent（如排版 Agent、发布 Agent），无需修改整体流程
- **容错性高**：某个 Agent 执行失败，可通过状态回滚或重新执行
- **数据共享**：通过状态（State）实现多 Agent 间的数据共享

## 14.6 循环与迭代控制（如 Plan-and-Execute）

### 14.6.1 简单循环：基于条件边的重试机制

最常见的循环控制就是通过"条件边"实现"重试直到满足条件"。核心要点：循环的终止条件必须明确，可通过 `max_steps` 参数限制最大循环次数。

```python
# 编译图时，设置最大循环次数（避免死循环）
app = graph.compile(max_steps=5)

# 执行时捕获异常，处理循环超限
try:
    final_state = app.invoke(initial_state)
except Exception as e:
    print(f"工作流执行失败：{e}（可能是循环次数超限）")
```

### 14.6.2 复杂迭代：Plan-and-Execute 架构

Plan-and-Execute（规划-执行）是一种高级迭代架构：

- **规划（Plan）**：Agent 先分析用户需求，生成详细的任务执行步骤
- **执行（Execute）**：按规划的步骤依次执行，记录执行结果
- **反思（Reflect）**：检查执行结果是否符合预期，若不符合则重新规划
- **终止**：所有步骤执行完成，或达到最大迭代次数

### 14.6.3 实战：Plan-and-Execute 写作工作流

```python
from langgraph.graph import Graph, END
from typing import TypedDict
from langchain.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

# 1. 定义状态
class PlanExecuteState(TypedDict):
    topic: str
    plan: list
    executed_steps: list
    results: dict
    reflect: str
    is_completed: bool

# 2. 定义核心节点
## 2.1 规划节点
def plan_node(state: PlanExecuteState) -> PlanExecuteState:
    prompt = f"围绕写作主题「{state['topic']}」，生成详细的任务执行步骤，步骤不超过3步，简洁具体。"
    plan = llm.invoke(prompt).content.split("\n")
    plan = [step.strip() for step in plan if step.strip()]
    return {**state, "plan": plan}

## 2.2 执行节点
def execute_node(state: PlanExecuteState) -> PlanExecuteState:
    unexecuted = [step for step in state["plan"] if step not in state["executed_steps"]]
    if not unexecuted:
        return {**state, "is_completed": True}

    current_step = unexecuted[0]
    results = state["results"].copy()

    if "调研" in current_step:
        results["调研"] = llm.invoke(f"围绕「{state['topic']}」，收集3条核心调研资料。").content
    elif "撰写" in current_step:
        research_data = results.get("调研", "无调研资料")
        results["撰写"] = llm.invoke(f"根据调研资料：{research_data}，撰写300字文章。").content
    elif "校对" in current_step:
        draft = results.get("撰写", "无草稿")
        results["校对"] = llm.invoke(f"校对草稿：{draft}，给出修改意见。").content

    executed_steps = state["executed_steps"].copy()
    executed_steps.append(current_step)
    return {**state, "executed_steps": executed_steps, "results": results}

## 2.3 反思节点
def reflect_node(state: PlanExecuteState) -> PlanExecuteState:
    prompt = f"任务主题：{state['topic']}\n已执行步骤：{state['executed_steps']}\n执行结果：{state['results']}\n判断：是否完成所有步骤？若完成返回'任务完成'，否则给出建议。"
    reflect = llm.invoke(prompt).content
    is_completed = "任务完成" in reflect
    return {**state, "reflect": reflect, "is_completed": is_completed}

# 3. 构建 Plan-and-Execute DAG
graph = Graph(state_schema=PlanExecuteState)

graph.add_node("plan", plan_node)
graph.add_node("execute", execute_node)
graph.add_node("reflect", reflect_node)

graph.add_edge("plan", "execute")
graph.add_edge("execute", "reflect")
graph.add_conditional_edges(
    start_node="reflect",
    condition=lambda state: state["is_completed"],
    mapping={True: END, False: "plan"}
)

graph.set_entry_point("plan")

# 4. 编译（设置最大迭代次数）
app = graph.compile(max_steps=5)

# 5. 执行工作流
initial_state = {
    "topic": "LangChain Plan-and-Execute 架构实战",
    "plan": [],
    "executed_steps": [],
    "results": {},
    "reflect": "",
    "is_completed": False
}

final_state = app.invoke(initial_state)

print("=== Plan-and-Execute 工作流完成 ===")
print(f"规划步骤：{final_state['plan']}")
print(f"\n已执行步骤：{final_state['executed_steps']}")
print(f"\n执行结果：{final_state['results']}")
print(f"\n反思意见：{final_state['reflect']}")
```

### 14.6.4 核心解析

- **规划节点**：负责生成任务步骤，为后续执行提供明确指引
- **执行节点**：按步骤执行任务，记录执行结果
- **反思节点**：作为"迭代核心"，检查执行结果，判断是否需要重新规划
- **循环控制**：通过"reflect→plan"的条件边，实现"规划→执行→反思→重新规划"的迭代

## 14.7 可视化 Graph 执行路径

### 14.7.1 方式1：使用 LangSmith 可视化（推荐）

LangSmith 是 LangChain 官方的调试和可视化平台，支持 LangGraph 的图结构、执行路径、状态变化的完整可视化。

**操作步骤**：

1. 安装依赖：`pip install langsmith`
2. 配置环境变量：
```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=你的LangSmith密钥
LANGCHAIN_PROJECT=langgraph-demo
```
3. 执行 LangGraph 工作流，LangSmith 会自动追踪
4. 登录 LangSmith 官网查看：图结构可视化、执行路径可视化、状态变化可视化

### 14.7.2 方式2：使用内置函数导出图结构

```bash
# 安装依赖
pip install graphviz
# Ubuntu 系统还需：sudo apt install graphviz
```

```python
# 导出图结构为 PNG 图片
from langgraph.graph import draw_graph
draw_graph(graph, format="png", filename="writing_workflow")
```

### 14.7.3 可视化的核心价值

- **调试便捷**：快速定位节点执行失败、流程流转错误的问题
- **流程清晰**：直观看到节点间的关系，便于优化工作流
- **团队协作**：可将可视化图片分享给团队，统一对工作流的理解

## 14.8 【实战】实现"调研 → 撰写 → 校对"写作 Agent

结合本章所有知识点，实战开发一个完整的写作 Agent：

- 多 Agent 协作：调研 Agent（带搜索引擎工具）、写作 Agent、校对 Agent 分工协作
- 条件分支：校对通过则输出最终文章，不通过则返回修改
- 循环控制：设置最大修改次数（3次），避免无限循环
- 状态管理：保存调研资料、文章草稿、校对意见等中间数据
- 可视化：支持导出图结构

### 14.8.1 实战准备

```bash
pip install langgraph langchain openai python-dotenv duckduckgo-search graphviz
```

环境变量配置（`.env` 文件）：
```
OPENAI_API_KEY=你的OpenAI API密钥
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=你的LangSmith密钥
LANGCHAIN_PROJECT=writing-agent-demo
```

### 14.8.2 完整实战代码

```python
from langgraph.graph import Graph, END
from typing import TypedDict
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools import DuckDuckGoSearchRun
from dotenv import load_dotenv
import os

# ---------------------- 1. 加载环境变量 ----------------------
load_dotenv()
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0.3,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# ---------------------- 2. 定义状态 ----------------------
class WritingAgentState(TypedDict):
    topic: str                  # 写作主题
    research_data: str          # 调研 Agent 输出的资料
    draft: str                  # 写作 Agent 输出的草稿
    review_comment: str         # 校对 Agent 输出的意见
    is_approved: bool           # 校对是否通过
    iteration: int              # 当前迭代次数

# ---------------------- 3. 初始化工具 ----------------------
search_tool = DuckDuckGoSearchRun()

# ---------------------- 4. 定义 Agent 节点 ----------------------
## 4.1 调研 Agent（带搜索引擎工具）
def research_agent(state: WritingAgentState) -> WritingAgentState:
    agent = initialize_agent(
        tools=[search_tool],
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=False
    )
    prompt = f"围绕「{state['topic']}」，搜索并收集3条最新核心调研资料，每条不超过50字。"
    research_data = agent.run(prompt)
    return {**state, "research_data": research_data}

## 4.2 写作 Agent
def writing_agent(state: WritingAgentState) -> WritingAgentState:
    # 如果有校对意见，结合意见修改
    review_hint = ""
    if state.get("review_comment") and state["iteration"] > 0:
        review_hint = f"\n请根据以下校对意见修改：{state['review_comment']}"

    prompt = f"根据调研资料：{state['research_data']}，撰写一篇300字左右的文章，逻辑清晰，语言流畅。{review_hint}"
    draft = llm.invoke(prompt).content
    return {**state, "draft": draft, "iteration": state.get("iteration", 0) + 1}

## 4.3 校对 Agent
def review_agent(state: WritingAgentState) -> WritingAgentState:
    prompt = f"校对文章草稿：{state['draft']}，检查语法错误、逻辑连贯性、用词准确性。若有问题给出具体修改意见；若无误返回'通过'。"
    comment = llm.invoke(prompt).content
    return {**state, "review_comment": comment, "is_approved": "通过" in comment}

# ---------------------- 5. 条件判断函数 ----------------------
def should_continue(state: WritingAgentState) -> str:
    if state["is_approved"]:
        return END
    if state.get("iteration", 0) >= 3:  # 最大修改3次
        return END
    return "writing_agent"

# ---------------------- 6. 构建 LangGraph ----------------------
graph = Graph(state_schema=WritingAgentState)

graph.add_node("research_agent", research_agent)
graph.add_node("writing_agent", writing_agent)
graph.add_node("review_agent", review_agent)

# 流程：调研 → 写作 → 校对 → 条件判断
graph.add_edge("research_agent", "writing_agent")
graph.add_edge("writing_agent", "review_agent")
graph.add_conditional_edges(
    start_node="review_agent",
    condition=should_continue,
    mapping={END: END, "writing_agent": "writing_agent"}
)

graph.set_entry_point("research_agent")

# ---------------------- 7. 编译并执行 ----------------------
app = graph.compile()

initial_state = {
    "topic": "LangChain与LangGraph在企业级AI应用中的最佳实践",
    "research_data": "",
    "draft": "",
    "review_comment": "",
    "is_approved": False,
    "iteration": 0
}

final_state = app.invoke(initial_state)

# ---------------------- 8. 输出结果 ----------------------
print("=" * 50)
print("写作 Agent 执行完成")
print("=" * 50)
print(f"主题：{final_state['topic']}")
print(f"\n调研资料：\n{final_state['research_data']}")
print(f"\n最终文章：\n{final_state['draft']}")
print(f"\n校对意见：\n{final_state['review_comment']}")
print(f"\n是否通过：{final_state['is_approved']}")
print(f"迭代次数：{final_state['iteration']}")
```

### 14.8.3 代码解析

本实战综合运用了本章所有核心知识点：

| 知识点 | 对应代码 |
|--------|---------|
| 状态管理 | `WritingAgentState` 定义共享状态 |
| 节点定义 | 3 个 Agent 函数作为节点 |
| DAG 构建 | `StateGraph` + `add_node` + `add_edge` |
| 条件分支 | `add_conditional_edges` + `should_continue` |
| 循环控制 | `iteration` 计数 + `max_steps` 保护 |
| 工具集成 | `DuckDuckGoSearchRun` 搜索工具 |
| 多 Agent 协作 | 调研/写作/校对三个独立 Agent |
