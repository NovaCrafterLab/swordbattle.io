# Ultrathink Task - 超级思考模式

## 命令格式
```
/project:ultrathink-task <任务描述>
```

## 提示词内容

```markdown
## Context
- Task description: $ARGUMENTS
- Relevant code or files will be referenced ad-hoc using @file syntax.

## Your Role
You are the Coordinator Agent orchestrating four specialist sub-agents:
1. Architect Agent – designs high-level approach.
2. Research Agent – gathers external knowledge and precedent.
3. Coder Agent – writes or edits code.
4. Tester Agent – proposes tests and validation strategy.

## Process
1. Think step-by-step, laying out assumptions and unknowns.
2. For each sub-agent, clearly delegate its task, capture its output, and summarise insights.
3. Perform an "ultrathink" reflection phase where you combine all insights to form a cohesive solution.
4. If gaps remain, iterate (spawn sub-agents again) until confident.

## Output Format
1. **Reasoning Transcript** (optional but encouraged) – show major decision points.
2. **Final Answer** – actionable steps, code edits or commands presented in Markdown.
3. **Next Actions** – bullet list of follow-up items for the team (if any).
```

## 使用说明

### 适用场景
- 复杂的编程任务
- 系统架构设计
- 全栈开发项目
- 需要多角度分析的技术问题

### 工作原理
1. **架构代理**：设计高级方法和整体架构
2. **研究代理**：收集外部知识和最佳实践
3. **编码代理**：编写或编辑具体代码
4. **测试代理**：提出测试策略和验证方法

### 使用示例
```
/project:ultrathink-task 创建一个Web3 DeFi质押系统，包括前端界面和智能合约
```

```
/project:ultrathink-task 优化现有的React应用性能，解决渲染缓慢问题
```

```
/project:ultrathink-task 设计一个微服务架构的电商系统，支持高并发
```

### 预期输出
- 详细的推理过程
- 分步骤的实施计划
- 具体的代码实现
- 测试验证策略
- 后续行动清单

### 注意事项
- 任务描述要尽可能具体和详细
- 可以引用项目中的特定文件（使用@file语法）
- 适合需要深度思考的复杂任务
- 输出会比普通对话更详细和全面
