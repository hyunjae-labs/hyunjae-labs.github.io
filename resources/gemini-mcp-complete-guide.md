# Gemini CLI MCP Configuration Reference

## Overview

Gemini CLI uses a `settings.json` file located in a `.gemini` directory within your project's root to configure and automatically launch MCP (Model Context Protocol) servers. This document provides a standard reference for the structure and format of this configuration file.

## Configuration Structure

The configuration is a JSON object containing a single top-level key, `mcpServers`. This key holds an object where each key is a unique name for a server, and the value is an object specifying how to run that server.

### Server Configuration Object

| Key       | Type     | Description                                                                                                |
| :-------- | :------- | :--------------------------------------------------------------------------------------------------------- |
| `command` | `String` | **Required.** The absolute path to the executable that runs the server (e.g., a Python interpreter).         |
| `args`    | `Array`  | **Required.** A list of string arguments to pass to the command. Typically includes the path to the server script. |
| `env`     | `Object` | **Optional.** An object of key-value pairs to set as environment variables for the server process.             |

---

## Configuration Templates

### Basic Template

Use this template as a starting point for your `.gemini/settings.json` file. Paths should be absolute and specific to your local machine.

```json
{
  "mcpServers": {
    "your-server-name": {
      "command": "/path/to/your/virtual_env/bin/python",
      "args": [
        "/path/to/your/server_script.py"
      ],
      "env": {
        "API_KEY": "your-secret-api-key"
      }
    }
  }
}
```

---

## Core MCP Server Examples

Below are configuration examples for standard, well-known MCP servers.

### Context7 Server

The **Context7** server provides access to library documentation, code examples, and best practices.

```json
{
  "mcpServers": {
    "context7": {
      "command": "/path/to/context7/virtual_env/bin/python",
      "args": [
        "/path/to/context7/server/main.py"
      ]
    }
  }
}
```

### Sequential Server

The **Sequential** server is designed for complex, multi-step problem-solving, architectural analysis, and systematic debugging.

```json
{
  "mcpServers": {
    "sequential": {
      "command": "/path/to/sequential/virtual_env/bin/python",
      "args": [
        "/path/to/sequential/server/main.py"
      ]
    }
  }
}
```

### Magic Server

The **Magic** server is used for modern UI component generation and integration with design systems.

```json
{
  "mcpServers": {
    "magic": {
      "command": "/path/to/magic/virtual_env/bin/python",
      "args": [
        "/path/to/magic/server/main.py"
      ],
      "env": {
        "DESIGN_SYSTEM_URL": "https://your.design.system/api"
      }
    }
  }
}
```

### Playwright Server

The **Playwright** server enables cross-browser automation, E2E testing, and performance monitoring.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "/path/to/playwright/virtual_env/bin/python",
      "args": [
        "/path/to/playwright/server/main.py"
      ]
    }
  }
}
```

---

## Multi-Server Configuration

Multiple servers can be configured by adding more entries to the `mcpServers` object. This example combines all the core servers.

```json
{
  "mcpServers": {
    "context7": {
      "command": "/path/to/context7/virtual_env/bin/python",
      "args": [
        "/path/to/context7/server/main.py"
      ]
    },
    "sequential": {
      "command": "/path/to/sequential/virtual_env/bin/python",
      "args": [
        "/path/to/sequential/server/main.py"
      ]
    },
    "magic": {
      "command": "/path/to/magic/virtual_env/bin/python",
      "args": [
        "/path/to/magic/server/main.py"
      ]
    },
    "playwright": {
      "command": "/path/to/playwright/virtual_env/bin/python",
      "args": [
        "/path/to/playwright/server/main.py"
      ]
    }
  }
}
```

---

## Platform-Specific Path Examples

### macOS & Linux Path Example

Use standard absolute paths.

```json
{
  "mcpServers": {
    "context7": {
      "command": "/home/user/servers/context7/venv/bin/python",
      "args": [
        "/home/user/servers/context7/main.py"
      ]
    }
  }
}
```

### Windows Path Example

On Windows, you must escape backslashes (`\`) in paths, or alternatively, use forward slashes (`/`).

```json
{
  "mcpServers": {
    "context7": {
      "command": "C:\\Users\\user\\servers\\context7\\venv\\Scripts\\python.exe",
      "args": [
        "C:\\Users\\user\\servers\\context7\\main.py"
      ]
    }
  }
}
```