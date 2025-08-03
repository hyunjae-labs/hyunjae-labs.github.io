# Blog AI Assistant Guide

## Context Structure

```
.claude-config/
├── core/           # Core principles and routing
├── content/        # Content writing guidelines
├── technical/      # Technical configurations  
├── workflow/       # Work preferences
└── security/       # Security and privacy
```

## Context Loading

Core Principles (Always loaded): @.claude-config/core/principles.md
Context Rules: @.claude-config/core/routing-rules.md

### Content Domain
Primary: @.claude-config/content/writing-guidelines.md
Structure: @.claude-config/content/content-structure.md  
Commits: @.claude-config/content/commit-conventions.md

### Technical Domain
Design: @.claude-config/technical/design-system.md
Config: @.claude-config/technical/site-config.md
Files: @.claude-config/technical/file-access.md

### Workflow Domain  
Preferences: @.claude-config/workflow/work-preferences.md
Problem Solving: @.claude-config/workflow/problem-solving.md

### Security Domain
Privacy: @.claude-config/security/privacy-rules.md
Contact: @.claude-config/security/contact-info.md

## Usage Patterns

Single Domain Tasks: Load primary + conditionals
Multi-Domain Tasks: Load all relevant primaries + core
Complex Operations: Load full context as needed


