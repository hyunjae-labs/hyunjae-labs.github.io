---
title: "Claude Code MCP Setup Guide"
date: 2025-01-03
draft: false
showToc: true
comments: false
description: "Claude Code Model Context Protocol (MCP) 서버 설정 가이드. 범용 설치, 설정, 문제 해결 방법."
tags: ["claude-code", "mcp", "setup", "configuration"]
---

## Overview

MCP (Model Context Protocol) is an open protocol that enables Claude Code to access external tools and data sources. This guide provides universal setup instructions for any system.

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **Claude Code**: Latest version (`claude update`)
- **PATH Configuration**: Ensure Node.js and npm are properly configured

### Environment Check
```bash
# Verify Node.js version
node --version

# Check npm configuration
npm config get prefix

# Update Claude Code
claude update
```

## Configuration Methods

Claude Code supports three MCP server configuration methods:

### 1. Command Line (Recommended)

Basic stdio server:
```bash
claude mcp add <server-name> <command>
```

With environment variables:
```bash
claude mcp add -e API_KEY=your_key -e CONFIG=value <server-name> <command>
```

Different transport types:
```bash
# HTTP server
claude mcp add --transport http <server-name> <url>

# SSE server  
claude mcp add --transport sse <server-name> <url>
```

### 2. Scope Management

#### Local Scope (Default)
Project-specific, personal configuration:
```bash
claude mcp add --scope local <server-name> <command>
```

#### Project Scope
Shared with team via `.mcp.json`:
```bash
claude mcp add --scope project <server-name> <command>
```

#### User Scope  
Available across all projects:
```bash
claude mcp add --scope user <server-name> <command>
```

### 3. JSON Configuration

For advanced configurations, create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "example-server": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "API_KEY": "your_api_key",
        "CONFIG_PATH": "/path/to/config"
      }
    },
    "remote-server": {
      "type": "http", 
      "url": "https://example.com/mcp",
      "authorization_token": "your_token"
    }
  }
}
```

## Configuration File Locations

### Settings Files
- **User settings**: `~/.claude/settings.json`
- **Project settings**: `.claude/settings.json`
- **Local project**: `.claude/settings.local.json` (git-ignored)

### MCP Configuration
- **Project MCP**: `.mcp.json` (project root)
- **User MCP**: `~/.claude/` directory

### Subagents
- **User agents**: `~/.claude/agents/`
- **Project agents**: `.claude/agents/`

## Management Commands

### Server Management
```bash
# List all configured servers
claude mcp list

# Get server details
claude mcp get <server-name>

# Remove server
claude mcp remove <server-name>

# Reset project choices
claude mcp reset-project-choices
```

### Authentication
```bash
# Manage MCP authentication
/mcp
```

### Configuration Management
```bash
# List configuration
claude config list

# Get specific setting
claude config get <key>

# Set configuration
claude config set <key> <value>

# Set global configuration
claude config set -g <key> <value>
```

## Common Server Examples

### NPX-based Server
```bash
claude mcp add example-server npx -y example-mcp-server
```

### Python Server
```bash
claude mcp add python-server python /path/to/venv/bin/python /path/to/server.py
```

### Remote HTTP Server
```bash
claude mcp add --transport http remote-api https://api.example.com/mcp
```

## Environment Variables

### Setting Variables
```bash
# Single variable
claude mcp add -e API_KEY=your_key server-name command

# Multiple variables  
claude mcp add -e VAR1=value1 -e VAR2=value2 server-name command
```

### JSON Configuration with Environment
```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "command",
      "args": ["arg1", "arg2"],
      "env": {
        "API_KEY": "your_api_key",
        "DEBUG": "true",
        "TIMEOUT": "30000"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

#### ModuleNotFoundError
```bash
# Verify command path
which <command>

# Test command directly
<command> --version
```

#### Server Connection Failed
```bash
# Check server status
claude mcp list

# Test server manually
<command> <args>
```

#### Permission Denied
```bash
# Check file permissions
ls -la <server-path>

# Grant execution permission if needed
chmod +x <server-path>
```

#### JSON Syntax Error
- Validate JSON syntax online
- Check quotes, commas, and brackets
- Ensure proper escape sequences

### Debug Mode
```bash
# Run Claude in debug mode
claude --debug

# Test MCP connectivity
/mcp
```

## Security Best Practices

### Server Verification
- Only use trusted MCP servers
- Review server source code when possible
- Check server documentation and security practices

### Permission Management
- Grant minimal required permissions
- Regularly review configured servers
- Use project scope for team servers, user scope carefully

### Authentication
- Store API keys securely
- Use environment variables instead of hardcoding
- Regularly rotate authentication tokens

### Network Security
- Verify HTTPS for remote servers
- Review server SSL certificates
- Monitor network traffic for sensitive operations

## Platform-Specific Notes

### Windows
- Use forward slashes in JSON paths or escape backslashes (`\\`)
- Consider PowerShell vs Command Prompt for commands
- Check PATH environment variable configuration

### macOS/Linux
- Standard Unix path conventions
- Check shell environment variables
- Verify file permissions with `ls -la`

### WSL (Windows Subsystem for Linux)
- Follow Linux conventions within WSL
- Be aware of Windows/Linux path translations
- Check Node.js installation location

## Advanced Configuration

### Multiple Environment Setup
```json
{
  "mcpServers": {
    "dev-server": {
      "type": "stdio",
      "command": "node",
      "args": ["dev-server.js"],
      "env": {"NODE_ENV": "development"}
    },
    "prod-server": {
      "type": "http",
      "url": "https://prod-api.example.com/mcp",
      "authorization_token": "${PROD_API_TOKEN}"
    }
  }
}
```

### Conditional Configuration
Use different configurations based on environment:
- Development: Local stdio servers
- Production: Remote HTTP servers  
- Testing: Mock servers

## Integration Examples

### Database Integration
```bash
claude mcp add database-server python /path/to/venv/bin/python -m database_mcp \
  -e DB_HOST=localhost \
  -e DB_NAME=myapp \
  -e DB_USER=user
```

### API Integration
```bash
claude mcp add api-server npx -y api-mcp-server \
  -e API_BASE_URL=https://api.example.com \
  -e API_KEY=your_key
```

### File System Tools
```bash
claude mcp add file-tools python /usr/bin/python3 -m file_tools_mcp \
  -e WORKSPACE_ROOT=/path/to/workspace
```

## Verification

### Test Installation
```bash
# List configured servers
claude mcp list

# Test server connectivity
claude --debug
/mcp

# Verify specific server
claude mcp get <server-name>
```

### Functionality Test
1. Start Claude with MCP server configured
2. Test server-specific functionality
3. Verify authentication if required
4. Check error logs for issues

## Next Steps

After successful MCP setup:

1. **Explore Server Capabilities**: Use `/mcp` to discover available tools
2. **Configure Authentication**: Set up OAuth or API keys as needed
3. **Team Collaboration**: Share project configurations via `.mcp.json`
4. **Monitor Usage**: Regular security and performance reviews
5. **Stay Updated**: Keep servers and Claude Code updated

## Resources

- **Official Documentation**: https://docs.anthropic.com/en/docs/claude-code/mcp
- **MCP Protocol**: https://modelcontextprotocol.io
- **Community Servers**: Explore available MCP servers
- **Security Guidelines**: Follow server-specific security recommendations

---

*This guide provides universal MCP setup instructions. Adapt paths and commands to your specific environment and requirements.*