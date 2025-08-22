# majin-marp-slide

A Model Context Protocol (MCP) server that returns a high-quality prompt for generating Marp slide decks. Provider-agnostic, NPX-friendly, and TypeScript-based.

## Requirements
- Node.js 18 or newer
- Any MCP client (Cursor, VS Code, Claude Desktop, Claude Code, Windsurf, LM Studio, Goose, etc.)

## Install and Run (Standard MCP config)
Add the server via your client using the following pattern:

```json
{
  "mcpServers": {
    "majin-marp-slide": {
      "command": "npx",
      "args": ["majin-marp-slide@1.0.0"]
    }
  }
}
```

VS Code (Insiders) install links:
- https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%401.0.0%22%5D%7D
- https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%401.0.0%22%5D%7D

### Tools
- marp_prompt: Returns a ready-to-use Marp slide generation prompt.

#### Example Calls
```json
{
  "tool": "marp_prompt",
  "arguments": {
    "title": "Modern TypeScript Patterns",
    "audience": "Intermediate developers",
    "pages": 15,
    "style": "tech",
    "language": "en"
  }
}
```

```json
{
  "tool": "marp_prompt",
  "arguments": {
    "title": "LLMのセキュリティベストプラクティス",
    "audience": "プロダクト開発チーム",
    "pages": 12,
    "style": "business",
    "language": "ja"
  }
}
```

### Development
```bash
npm install
npm run build
```

### Notes
- Pin with @1.0.0 for stability if desired
- Provider-agnostic by design
