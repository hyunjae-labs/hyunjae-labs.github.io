# Intelligent Context Routing Rules

## 🎯 Task Classification Engine

### Content Domain Tasks
```yaml
triggers:
  primary: ["write", "post", "create", "글", "작성", "톤", "스타일", "블로그"]
  modifiers: ["commit", "structure", "resources", "guidelines"]

context_assembly:
  core: ["core/principles.md"]
  primary: ["content/writing-guidelines.md"]
  conditional:
    structure_focus: ["content/content-structure.md"]
    commit_related: ["content/commit-conventions.md"] 
    resources_type: ["security/privacy-rules.md"]
```

### Technical Domain Tasks
```yaml
triggers:
  primary: ["design", "layout", "menu", "config", "설정", "디자인", "파일"]
  modifiers: ["responsive", "theme", "navigation", "access"]

context_assembly:
  core: ["core/principles.md"]
  primary: ["technical/design-system.md"]
  conditional:
    config_focus: ["technical/site-config.md"]
    file_operations: ["technical/file-access.md"]
```

### Workflow Domain Tasks  
```yaml
triggers:
  primary: ["작업", "방식", "문제", "해결", "접근", "workflow", "process"]
  modifiers: ["debugging", "optimization", "methodology", "efficiency"]

context_assembly:
  core: ["core/principles.md"]
  primary: ["workflow/work-preferences.md"]
  always: ["workflow/problem-solving.md"]
```

### Security Domain Tasks
```yaml
triggers:
  primary: ["개인정보", "보안", "프라이버시", "연락처", "privacy", "contact"]
  modifiers: ["protection", "rules", "compliance"]

context_assembly:
  core: ["core/principles.md"]
  primary: ["security/privacy-rules.md"]
  conditional:
    contact_info: ["security/contact-info.md"]
```

## 🏗️ Context Assembly Strategy

### Assembly Patterns
1. **Core-First**: Always load `core/principles.md`
2. **Domain-Primary**: Load primary domain context
3. **Conditional-Logic**: Apply modifier-based conditions
4. **Cross-Domain**: Merge contexts for complex tasks

### Priority Resolution Matrix
```
HIGHEST: Core Principles (SSOT)
HIGH:    User Explicit Preferences  
MEDIUM:  Domain-Specific Rules
LOW:     Auto-Detection Defaults
```

### Conflict Resolution
- **SSOT Enforcement**: Core principles override domain rules
- **DRY Validation**: Check for duplicate rule loading
- **SRP Compliance**: Ensure single responsibility per context

## 🔍 Advanced Detection Patterns

### Multi-Domain Detection
```yaml
content_technical:
  triggers: ["responsive design post", "CSS tutorial", "design guidelines"]
  assembly: [content/, technical/design-system.md]

workflow_security:
  triggers: ["secure development process", "privacy workflow"]
  assembly: [workflow/, security/]

technical_workflow:
  triggers: ["deployment process", "file management workflow"]
  assembly: [technical/, workflow/problem-solving.md]
```

### Context Validation Pipeline
1. **Syntax Check**: YAML structure validation
2. **Dependency Check**: Required files exist?
3. **Circular Reference**: No infinite loops?
4. **Coverage Analysis**: All task aspects covered?
5. **Performance Check**: Context load time < 100ms