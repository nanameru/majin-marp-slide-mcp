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

## Publish to npm for NPX usage on other machines
Follow these steps to publish so others can run it via `npx` without cloning:

1. Create/sign in to an npm account: https://www.npmjs.com/
2. Login from your terminal:
   ```bash
   npm login
   ```
3. Verify login:
   ```bash
   npm whoami
   ```
4. Ensure the package name is unique on npm. If you prefer a scoped name, set it in `package.json` (e.g. `@your-scope/majin-marp-slide`) and keep `publishConfig.access` as `public`.
5. Build the project:
   ```bash
   npm run build
   ```
6. Publish (public):
   ```bash
   npm publish --access public
   ```
7. Versioning for updates (example: patch):
   ```bash
   npm version patch -m "chore: release %s"
   git push --follow-tags
   npm publish --access public
   ```

### Use from any machine (NPX)
Once published, configure your MCP client to run it via NPX:

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

Replace `1.0.0` with your published version.

