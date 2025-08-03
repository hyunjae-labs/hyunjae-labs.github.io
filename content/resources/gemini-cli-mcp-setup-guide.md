---
title: "Gemini CLI MCP Setup Guide"
date: 2025-01-03
draft: false
showToc: true
comments: false
description: "Gemini CLI Model Context Protocol (MCP) 서버 설정 가이드. settings.json 구성, 인증, 보안 설정."
tags: ["gemini-cli", "mcp", "configuration", "settings"]
---

## Overview

Gemini CLI uses Model Context Protocol (MCP) servers to extend its capabilities by connecting to external tools and data sources. This guide covers configuration, setup, and best practices for MCP server integration.

## Configuration Methods

### Configuration File Locations
- **Global**: `~/.gemini/settings.json` (affects all projects)
- **Project**: `.gemini/settings.json` (project-specific, team shareable)

### Basic Configuration Structure

MCP servers are configured in the `mcpServers` object within your settings.json file:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "path/to/executable",
      "args": ["arg1", "arg2"],
      "env": {"KEY": "value"},
      "timeout": 30000,
      "trust": false
    }
  }
}
```

## Configuration Options

### Transport Methods (Choose One)

| Option | Type | Description |
|--------|------|-------------|
| `command` | String | Path to executable for stdio transport |
| `url` | String | SSE (Server-Sent Events) endpoint URL |
| `httpUrl` | String | HTTP streaming endpoint URL |

### Optional Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `args` | Array | `[]` | Command-line arguments |
| `env` | Object | `{}` | Environment variables |
| `cwd` | String | - | Working directory for command execution |
| `timeout` | Number | 600000 | Request timeout in milliseconds (10 minutes) |
| `trust` | Boolean | `false` | Bypass tool call confirmation dialogs |
| `headers` | Object | `{}` | Custom HTTP headers (for HTTP/SSE transport) |
| `includeTools` | Array | - | Whitelist specific tools |
| `excludeTools` | Array | - | Blacklist specific tools |

## Server Configuration Examples

### Basic Stdio Server
```json
{
  "mcpServers": {
    "python-tools": {
      "command": "python",
      "args": ["-m", "mcp_server"],
      "env": {
        "API_KEY": "$MY_API_TOKEN"
      },
      "cwd": "/path/to/server/directory"
    }
  }
}
```

### SSE Server
```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://api.example.com/sse",
      "headers": {
        "Authorization": "Bearer $ACCESS_TOKEN"
      },
      "timeout": 30000
    }
  }
}
```

### HTTP Streaming Server
```json
{
  "mcpServers": {
    "http-server": {
      "httpUrl": "https://api.example.com/stream",
      "headers": {
        "X-API-Key": "$API_KEY"
      }
    }
  }
}
```

## Tool Management

### Including Specific Tools
```json
{
  "mcpServers": {
    "server-name": {
      "command": "python",
      "args": ["-m", "mcp_server"],
      "includeTools": ["tool1", "tool2", "tool3"]
    }
  }
}
```

### Excluding Specific Tools
```json
{
  "mcpServers": {
    "server-name": {
      "command": "python", 
      "args": ["-m", "mcp_server"],
      "excludeTools": ["dangerous_tool", "unwanted_tool"]
    }
  }
}
```

## Security Configuration

### Trusted Server (Auto-approve Tools)
```json
{
  "mcpServers": {
    "trusted-server": {
      "command": "python",
      "args": ["-m", "my_trusted_server"],
      "trust": true
    }
  }
}
```

**⚠️ Warning**: Only set `trust: true` for servers you've written yourself and fully understand.

### Environment Variable Security
```json
{
  "mcpServers": {
    "secure-server": {
      "command": "python",
      "args": ["-m", "secure_server"],
      "env": {
        "API_KEY": "$SECURE_API_TOKEN",
        "DATABASE_URL": "$DATABASE_CONNECTION"
      }
    }
  }
}
```

## Multi-Server Configuration

```json
{
  "mcpServers": {
    "file-tools": {
      "command": "python",
      "args": ["-m", "file_mcp_server"],
      "cwd": "/workspace"
    },
    "web-api": {
      "url": "https://api.service.com/sse",
      "headers": {
        "Authorization": "Bearer $API_TOKEN"
      }
    },
    "database": {
      "command": "node",
      "args": ["database-server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432"
      },
      "excludeTools": ["destructive_ops"]
    }
  }
}
```

## Platform-Specific Examples

### macOS/Linux
```json
{
  "mcpServers": {
    "local-server": {
      "command": "/usr/bin/python3",
      "args": ["/opt/mcp-servers/server.py"],
      "cwd": "/opt/mcp-servers"
    }
  }
}
```

### Windows
```json
{
  "mcpServers": {
    "local-server": {
      "command": "C:\\Python311\\python.exe",
      "args": ["C:\\mcp-servers\\server.py"],
      "cwd": "C:\\mcp-servers"
    }
  }
}
```

## OAuth Authentication

For servers supporting OAuth:

```json
{
  "mcpServers": {
    "oauth-server": {
      "url": "https://oauth-server.example.com/sse"
    }
  }
}
```

Gemini CLI will automatically:
- Discover OAuth configuration
- Launch browser for authentication
- Manage token refresh
- Store credentials securely

## Troubleshooting

### Common Issues

#### Server Not Starting
- Verify `command` path exists and is executable
- Check `cwd` directory permissions
- Validate environment variables are set

#### Timeout Errors
```json
{
  "mcpServers": {
    "slow-server": {
      "command": "python",
      "args": ["-m", "slow_server"],
      "timeout": 120000
    }
  }
}
```

#### Tool Conflicts
Use `includeTools` or `excludeTools` to manage conflicts between servers.

### Debugging
Enable debug mode in Gemini CLI to see detailed MCP communication:
```bash
gemini --debug
```

## Best Practices

### Security
- Never set `trust: true` for untrusted servers
- Use environment variables for sensitive data
- Review server source code before configuration
- Regularly audit configured servers

### Performance
- Set appropriate timeout values
- Use `cwd` to ensure correct working directory
- Filter tools with `includeTools`/`excludeTools`
- Monitor server resource usage

### Development
- Use project-specific configuration for team sharing
- Version control `.gemini/settings.json`
- Document server purposes and requirements
- Test configurations in isolated environments

## Resources

- **Official Documentation**: https://gemini-cli.xyz/docs/en/tools/mcp-server
- **GitHub Repository**: https://github.com/google-gemini/gemini-cli
- **MCP Protocol**: https://modelcontextprotocol.io
- **Community Servers**: Explore available MCP implementations

---

*Configure MCP servers securely and efficiently with Gemini CLI.*