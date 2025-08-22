# majin-marp-slide MCP 生成プロンプト（完全版）

以下の要件に従って、Node.js/TypeScript製のMCPサーバー `majin-marp-slide` を自動生成・構築・公開できるように実装してください。生成するファイルはすべてプロジェクト直下に作成します。

## 目的
- 実行すると Marp スライドを生成するための高品質プロンプト文字列を返す MCP サーバーを提供する。
- どのPCでも `npx` で実行可能（npm 公開）にする。

## 技術仕様（固定）
- Node.js 18+
- TypeScript
- ESM (`"type": "module"`)
- パッケージ: `@modelcontextprotocol/sdk`（MCP SDK）, `zod`（引数バリデーション）, `dotenv`（任意）
- エントリ: `src/index.ts`
- 出力: `build/index.js`
- `bin` 経由で STDIO サーバー起動

## ツール仕様
- ツール名: `marp_prompt`
- 説明: Marpでスライドを生成するための高品質プロンプト文字列を返す
- 引数:
  - `title`: string（必須）
  - `audience`: string（任意）
  - `pages`: number（任意）
  - `style`: "tech" | "business" | "conference"（任意）
  - `language`: "ja" | "en"（任意、既定は"ja"）
- 返却: `prompt: string`（Marp記法、目次、スピーカーノート方針、セクション構成ガイド等を含む即利用可能な指示文）

## 必須ファイル
1) package.json
- ESM, `main: build/index.js`, `files: ["build"]`
- `bin`: `{ "majin-marp-slide": "./build/index.js" }`
- scripts:
  - `build`: `tsc && chmod 755 build/index.js`
  - `prepare`: `npm run build`
- dependencies: `@modelcontextprotocol/sdk`, `zod`, `dotenv`
- devDependencies: `typescript`, `@types/node`
- engines: `>=18`

2) tsconfig.json
- target/module: `ES2022`
- moduleResolution: `Bundler`
- outDir: `build`, rootDir: `src`
- strict, esModuleInterop, skipLibCheck: true

3) src/index.ts
- `@modelcontextprotocol/sdk/server/mcp.js` の `McpServer` を使用
- `StdioServerTransport` で STDIO 接続
- `zod` で引数バリデーション
- `marp_prompt` ツールを登録し、Marp用プロンプト文字列を返す
- 例外処理と入力バリデーション実装

4) README.md（英語のみ、以下のスタイルに準拠）

# Next.js Docs MCP

A Model Context Protocol (MCP) server that provides all Next.js documentation URLs to AI agents like Claude for intelligent document selection. This server contains a comprehensive static database of Next.js documentation pages and enables AI agents to analyze and select the most relevant documentation based on user queries.

## Key Features

- **AI Agent Integration**: Provides all documentation URLs for Claude and other AI agents to analyze and select relevant docs
- **Comprehensive Static Database**: Contains 200+ Next.js documentation URLs across all categories
- **No External Dependencies**: Pure static URL database with no API calls or crawling required
- **Claude-Optimized**: Specifically designed for Claude to intelligently select relevant documentation
- **npx-Ready**: No local installation needed - run via `npx` from any MCP client

## Requirements

- Node.js 18 or newer
- VS Code, Cursor, Windsurf, Claude Desktop, Goose, LM Studio, or any other MCP client

## Getting Started

### Installation

**Standard config** works in most tools:

```json
{
  "mcpServers": {
    "majin-marp-slide": {
      "command": "npx",
      "args": ["majin-marp-slide@latest"]
    }
  }
}
```

[Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%40latest%22%5D%7D)
[Install in VS Code Insiders](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%40latest%22%5D%7D)

### Client-Specific Setup

<details>
<summary><b>Claude Code (Recommended)</b></summary>

Use the Claude Code CLI to add the MCP server:

```bash
claude mcp add majin-marp-slide -- npx majin-marp-slide@latest
```

Remove if needed:
```bash
claude mcp remove majin-marp-slide
```
</details>

<details>
<summary>Claude Desktop</summary>

Follow the MCP install guide and use the standard config above.

- Guide: https://modelcontextprotocol.io/quickstart/user
</details>

<details>
<summary>Cursor</summary>

Go to `Cursor Settings` → `MCP` → `Add new MCP Server`.

Use the following:
- Name: majin-marp-slide
- Type: command
- Command: npx
- Args: majin-marp-slide@latest
- Auto start: on (optional)
</details>

<details>
<summary>VS Code</summary>

Add via CLI:

```bash
code --add-mcp '{"name":"majin-marp-slide","command":"npx","args":["majin-marp-slide@latest"]}'
```

Or use the install links above.
</details>

<details>
<summary>LM Studio</summary>

Add MCP Server with:
- Command: npx
- Args: ["majin-marp-slide@latest"]
</details>

<details>
<summary>Goose</summary>

Advanced settings → Extensions → Add custom extension:
- Type: STDIO
- Command: npx
- Args: majin-marp-slide@latest
- Enabled: true
</details>

<details>
<summary>opencode</summary>

Example `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "majin-marp-slide": {
      "type": "local",
      "command": [
        "npx",
        "majin-marp-slide@latest"
      ],
      "enabled": true
    }
  }
}
```
</details>

<details>
<summary>Qodo Gen</summary>

Open Qodo Gen → Connect more tools → + Add new MCP → Paste the standard config above → Save.
</details>

<details>
<summary>Windsurf</summary>

Follow Windsurf MCP documentation and use the standard config above.
- Docs: https://docs.windsurf.com/windsurf/cascade/mcp
</details>

## Available Tools

### 1. marp_prompt
Return a high-quality Marp slide generation prompt string.

**Parameters:**
- `title` (string, required)
- `audience` (string, optional)
- `pages` (number, optional)
- `style` ("tech" | "business" | "conference", optional)
- `language` ("ja" | "en", optional, default "ja")

**Response:**
- `prompt` (string): Marp front-matter, agenda, speaker notes guidance, structure

## Usage Examples

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

## Publish to npm for NPX usage on other machines
Follow these steps so anyone can run via `npx` without cloning:

1. Create/sign in to an npm account: https://www.npmjs.com/
2. Login from your terminal:
   ```bash
   npm login
   ```
3. Verify login:
   ```bash
   npm whoami
   ```
4. Ensure the package name is unique on npm. Optionally set a scoped name in `package.json` (e.g., `@your-scope/majin-marp-slide`) and keep `publishConfig.access` as `public`.
5. Build the project:
   ```bash
   npm run build
   ```
6. Publish (public):
   ```bash
   npm publish --access public
   ```
7. Version updates:
   ```bash
   npm version patch -m "chore: release %s"
   git push --follow-tags
   npm publish --access public
   ```

## 注意
- README は必ず英語のみ
- UI変更は行わない
- ライブラリのバージョンは変更しない（必要時は明示）
