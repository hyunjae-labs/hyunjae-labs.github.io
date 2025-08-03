# Claude MCP Complete Setup Guide

## Overview

This comprehensive guide covers **Claude Code MCP server setup** and **Claude Sub Agent configuration** for advanced AI-assisted development workflows.

**Prerequisites**: Complete the [Universal Installation Guide](01_UNIVERSAL_INSTALLATION.md) to have MCP servers installed.

## Architecture Overview

```
┌─────────────────┐    .mcp.json     ┌─────────────────┐
│   Claude Code   │ ←──────────────→ │   Local Server  │
│                 │                  │  (Python-based) │
│  - CLI Methods  │                  │                 │
│  - JSON Config  │                  │  - stdio comm   │
│  - Scope Mgmt   │                  │  - Virtual env  │
└─────────────────┘                  └─────────────────┘
        │
        │ Sub Agents
        ▼
┌─────────────────┐    .claude/      ┌─────────────────┐
│ Specialized     │ ←── agents/ ────→ │ Custom AI       │
│ Task Agents     │                  │ Subagents       │
└─────────────────┘                  └─────────────────┘
```

# Part I: MCP Server Setup

Claude Code supports **3 methods** for MCP server registration:

## Method 1: Command Line (Simplest)

```bash
claude mcp add <server-name> <python-path> <server-script-path>
```

**Examples**:
```bash
# PowerPoint MCP Server
claude mcp add ppt /Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/.venv/bin/python /Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/ppt_mcp_server.py

# PDF Tools MCP Server
claude mcp add pdf-tools /Users/hyunjaelim/mcp-servers/mcp-pdf-tools/venv/bin/python /Users/hyunjaelim/mcp-servers/mcp-pdf-tools/src/pdf_tools/server.py

# Memory MCP Server
claude mcp add memory /Users/hyunjaelim/mcp-servers/memory-mcp/.venv/bin/python /Users/hyunjaelim/mcp-servers/memory-mcp/memory_server.py
```

## Method 2: JSON Configuration (Advanced)

```bash
claude mcp add-json <server-name> '{
  "type": "stdio",
  "command": "<python-path>",
  "args": ["<server-script-path>"],
  "env": {}
}'
```

**Example**:
```bash
claude mcp add-json ppt '{
  "type": "stdio",
  "command": "/Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/.venv/bin/python",
  "args": ["/Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/ppt_mcp_server.py"],
  "env": {}
}'
```

## Method 3: Auto-Recognition (Project-wide)

Create `.mcp.json` in project root for automatic detection:

```json
{
  "mcpServers": {
    "notebook": {
      "type": "stdio",
      "command": "the-notebook-mcp",
      "args": [
        "start",
        "--allow-root",
        "/Users/hyunjaelim/AIBC/aibc-materials",
        "--transport",
        "stdio"
      ],
      "env": {}
    },
    "ppt": {
      "type": "stdio", 
      "command": "/Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/.venv/bin/python",
      "args": ["/Users/hyunjaelim/mcp-servers/Office-PowerPoint-MCP-Server/ppt_mcp_server.py"],
      "env": {}
    }
  }
}
```

## Scope Management

Claude Code provides 3 scope levels:

### Local Scope (Default)
Available only in current working directory:
```bash
claude mcp add --scope local <server-name> <python-path> <server-script-path>
```

### Project Scope (Team Sharing)
Shared via `.mcp.json` file with team members:
```bash
claude mcp add --scope project <server-name> <python-path> <server-script-path>
```

### User Scope (Global)
Available across all projects:
```bash
claude mcp add --scope user <server-name> <python-path> <server-script-path>
```

## Environment Variables

Some MCP servers require API keys or configuration values.

### Command Line Method
```bash
claude mcp add -e API_KEY=your_api_key -e CONFIG_PATH=/path/to/config <server-name> <python-path> <server-script-path>
```

### JSON Method
```bash
claude mcp add-json <server-name> '{
  "type": "stdio",
  "command": "<python-path>",
  "args": ["<server-script-path>"],
  "env": {
    "API_KEY": "your_api_key",
    "CONFIG_PATH": "/path/to/config"
  }
}'
```

## Management Commands

### List Servers
```bash
claude mcp list
```

### Get Server Details
```bash
claude mcp get <server-name>
```

### Remove Server
```bash
claude mcp remove <server-name>
```

### Reset Project Choices
```bash
claude mcp reset-project-choices
```

## Project-Specific Configurations

### PowerPoint MCP
- Server file: `ppt_mcp_server.py` (project root)
- Virtual environment: `.venv`
- Additional packages: `python-pptx`, `Pillow`, `fonttools`

### PDF Tools MCP
- Server file: `src/pdf_tools/server.py` (subfolder location)
- Virtual environment: `venv` (not `.venv`)
- Installation method: `pip install -e .`

### Memory MCP
- Server file: `memory_server.py`
- May require environment variables
- ChromaDB dependency

### Jupyter MCP
- Recommended: Project configuration file (`.mcp.json`)
- May need `--allow-root` option

# Part II: Claude Sub Agent Setup

Claude Sub Agents are specialized AI assistants for specific tasks, different from MCP servers.

## Sub Agent Management

### Access Agent Management Interface
```bash
/agents
```

This opens the "Manage custom AI subagents for specialized tasks" interface.

## Creating Sub Agents

### Method 1: CLI Interface (Recommended)

1. **Enter Agent Management**
   ```bash
   /agents
   ```

2. **Create New Agent**
   - Select new agent creation option
   - **Scope Selection**:
     - **Project-specific**: `.claude/agents/` (shareable with team)
     - **Personal**: `~/.claude/agents/` (all projects)

3. **Agent Configuration**
   - **Name**: lowercase English, hyphens allowed (e.g., `miou-logger`, `error-analyzer`)
   - **Description**: Clear role description
   - **Tools**: Select only necessary tools for security

4. **Write Agent Instructions (Prompt)**
   - Specify concrete work methods
   - Define output format (e.g., "Results as markdown table")
   - Reference documents (e.g., "Include CV_CHALLENGE_KNOWLEDGE_BASE.md references")

### Method 2: Direct File Creation (Advanced)

**File Location**:
- **Project-specific**: `.claude/agents/agent-name.md`
- **Personal**: `~/.claude/agents/agent-name.md`

**File Structure** (YAML frontmatter + Markdown):
```markdown
---
name: miou-logger
description: Systematically logs mIoU experiment results and generates presentation tables
tools: ["FileRead", "Write", "Bash", "Edit"]
---

## Task Instructions

Record all experiment results in this markdown table format:

| Experiment | Date | Epoch | mIoU | Model | Failure Reason | Notes |
|------------|------|-------|------|-------|----------------|-------|
| exp_001 | 2025-07-29 | 50 | 0.85 | UNet | - | Baseline |

Always include relevant sections from CV_CHALLENGE_KNOWLEDGE_BASE.md as evidence,
and for failed experiments, include TensorBoard log analysis results.
```

## YAML Field Reference

### Required Fields
- `name`: Unique agent identifier (English, hyphens allowed, no duplicates)
- `description`: Agent role and purpose description

### Optional Fields
- `tools`: Array of allowed tools (specify only necessary tools for security)
  - Example: `["FileRead", "Write", "Bash", "Edit", "Grep", "Glob"]`

## Using Sub Agents

### Automatic Invocation
Claude automatically uses appropriate sub agents based on context.

### Explicit Invocation (Recommended)
```
Use the miou-logger sub agent to record this experiment.
```
```
Pass these error logs to the error-analyzer agent.
```

### Chain/Sequential Tasks
```
First let code-analyzer agent check the implementation, 
then let optimizer agent fix any performance issues found.
```

## CV Challenge Specialized Agents

### Experiment Logger Agent
```markdown
---
name: experiment-logger
description: Systematically records CV experiment results and generates presentation materials
tools: ["FileRead", "Write", "Edit"]
---

## Recording Rules

Record all experiments in this format:

1. **Experiment Metadata**
   - Experiment name, execution date/time
   - Model used, hyperparameters
   - Dataset information

2. **Performance Metrics**
   - mIoU, Loss change trends
   - Training time, memory usage

3. **Failure Analysis** (if applicable)
   - Error log analysis
   - Cause estimation and solutions
   - CV_CHALLENGE_KNOWLEDGE_BASE.md relevant section references

Format all results as tables for direct presentation use.
```

### Code Quality Analyzer Agent
```markdown
---
name: code-analyzer
description: Analyzes CV code quality, performance, and Week3 curriculum pattern compliance
tools: ["FileRead", "Grep", "Bash"]
---

## Analysis Checklist

### 1. Week3 Curriculum Pattern Compliance
- [ ] Data pipeline structure
- [ ] Model architecture implementation
- [ ] Loss function and optimization settings

### 2. Performance Optimization
- [ ] Batch size optimization
- [ ] Data loading efficiency
- [ ] GPU memory usage

### 3. Logging and Monitoring
- [ ] TensorBoard implementation status
- [ ] Checkpoint saving logic
- [ ] Experiment reproducibility

Provide all analysis results with improvement recommendations.
```

### Error Analysis Agent
```markdown
---
name: error-analyzer
description: Specialized in log analysis and cause diagnosis for experiment failures
tools: ["FileRead", "Grep", "Bash"]
---

## Error Analysis Process

1. **Log Collection**
   - Training logs, error messages
   - TensorBoard records
   - System resource usage

2. **Pattern Analysis**
   - Identify common error patterns
   - Match with known issues in CV_CHALLENGE_KNOWLEDGE_BASE.md

3. **Solution Recommendations**
   - Step-by-step fix guide
   - Alternative approaches
   - Prevention measures

Prioritize Week3 curriculum-based solutions for all analyses.
```

## Advanced Usage Patterns

### Role-Based Agent Separation Strategy
- **Analysis Phase**: `code-analyzer` → Code quality review
- **Execution Phase**: `experiment-runner` → Experiment execution and monitoring
- **Recording Phase**: `experiment-logger` → Results organization and documentation
- **Problem Solving**: `error-analyzer` → Failure cause analysis and solutions

### Customized Tool Permissions
- **Experiment Execution**: `Bash`, `FileRead`, `Write` permissions
- **Recording Only**: `FileRead`, `Write`, `Edit` permissions (no Bash for safety)
- **Analysis Only**: `FileRead`, `Grep`, `Glob` permissions

### Team Collaboration

#### Project Agent Sharing
- Version control `.claude/agents/` folder with Git
- Apply consistent workflows and quality standards across team
- Share agent improvements with team members

#### Role-Specific Expert Agents
- Each team member develops specialized agents for their expertise
- Systematize best practices as agents
- Achieve knowledge sharing and standardization

# Troubleshooting

## Common MCP Server Issues

### 1. ModuleNotFoundError
**Problem**: Python modules not found
```bash
# Solution: Verify virtual environment Python path
<python-path> -c "import mcp; print('Module load success')"
```

### 2. Server Registration Failed
**Problem**: Incorrect paths or missing files
```bash
# Solution: Re-verify paths
ls -la <python-path>
ls -la <server-script-path>
```

### 3. JSON Format Error
**Problem**: JSON syntax error causing registration failure
```bash
# Solution: Verify JSON syntax (quotes, commas, braces)
# Use online JSON validators
```

### 4. Permission Issues
**Problem**: Missing file execution permissions
```bash
# Solution: Grant execution permissions
chmod +x <server-script-path>
```

### 5. Port Conflicts
**Problem**: Duplicate registration with same server name
```bash
# Solution: Remove existing server then re-register
claude mcp remove <server-name>
claude mcp add <server-name> <python-path> <server-script-path>
```

## Common Sub Agent Issues

### 1. Agent Not Found
**Problem**: Agent file not in correct location
```bash
# Solution: Check file location
ls -la .claude/agents/
ls -la ~/.claude/agents/
```

### 2. YAML Parsing Error
**Problem**: Incorrect YAML frontmatter format
```bash
# Solution: Verify YAML syntax
# Ensure proper --- delimiters
# Check indentation and quotes
```

### 3. Tool Permission Denied
**Problem**: Agent trying to use unauthorized tools
```bash
# Solution: Add required tools to agent configuration
# Update tools array in YAML frontmatter
```

# Optimization Tips

## Batch Setup Script
```bash
#!/bin/bash
# setup_claude_complete.sh

BASE_DIR="/Users/hyunjaelim/mcp-servers"

# MCP Servers
claude mcp add ppt "${BASE_DIR}/Office-PowerPoint-MCP-Server/.venv/bin/python" "${BASE_DIR}/Office-PowerPoint-MCP-Server/ppt_mcp_server.py"
claude mcp add pdf-tools "${BASE_DIR}/mcp-pdf-tools/venv/bin/python" "${BASE_DIR}/mcp-pdf-tools/src/pdf_tools/server.py"
claude mcp add memory "${BASE_DIR}/memory-mcp/.venv/bin/python" "${BASE_DIR}/memory-mcp/memory_server.py"

echo "All MCP servers registered"
claude mcp list

# Create essential sub agents directory
mkdir -p .claude/agents

echo "Setup complete - Use /agents to create specialized sub agents"
```

## Configuration Backup
```bash
# Backup current MCP settings
claude mcp list > mcp_backup.txt

# Backup sub agents
cp -r .claude/agents .claude/agents.backup
```

## Next Steps

After completing Claude MCP setup:

1. **[Tool-Specific Guides](../tools/)** - Learn advanced features of specific MCP tools
2. **[Troubleshooting Matrix](TROUBLESHOOTING_MATRIX.md)** - Advanced troubleshooting methods
3. **[Quick Commands Reference](QUICK_COMMANDS.md)** - Frequently used commands
4. **Create specialized sub agents** for your project workflow
5. **Set up team collaboration** with shared agents and MCP configurations

---

*Maximize productivity with Claude Code's powerful MCP ecosystem and specialized sub agents!*