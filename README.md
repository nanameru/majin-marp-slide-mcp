# majin-marp-slide

Marp スライドのための高品質な生成プロンプトを返す Model Context Protocol (MCP) サーバーです。プロバイダー非依存、NPX で簡単実行、TypeScript 製。

## 特徴

- **高品質プロンプト**: タイトルや対象読者、ページ数、スタイル、言語に応じて最適化
- **MCP 準拠**: 主要 MCP クライアント（Cursor / VS Code / Claude Desktop など）から利用可能
- **ゼロインストール運用**: `npx` でそのまま起動可能（ローカルビルドも可）

## 前提条件

- Node.js 18 以上
- MCP クライアント（Cursor, VS Code Insiders, Claude Desktop, 等）

## インストール / 設定

### 1) MCP クライアントへの追加（推奨）

プロジェクトやグローバルの MCP 設定に以下を追記してください（例: `.cursor/mcp.json`）。

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

VS Code (Insiders) からワンクリックで追加する場合は以下をご利用ください：

- [Install to VS Code (web)](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%401.0.0%22%5D%7D)
- [Install to VS Code Insiders (desktop)](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%7B%22name%22%3A%22majin-marp-slide%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22majin-marp-slide%401.0.0%22%5D%7D)

### 2) ローカルでビルドして使う

```bash
npm install
npm run build
```

生成物は `build/index.js` に出力されます。MCP クライアントから `node build/index.js` をコマンドとして指定しても動作します。

## 使い方

このサーバーには以下のツールが提供されています。

- **marp_prompt**: Marp スライド生成にそのまま使えるプロンプト文字列を返します。

### 引数

- **title**: スライドのタイトル（必須）
- **audience**: 想定読者（任意）
- **pages**: 想定ページ数（任意, 正の整数）
- **style**: プレゼンスタイル（`tech` | `business` | `conference`）
- **language**: 言語（`ja` | `en`）

### 呼び出し例

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

## 開発

```bash
npm install
npm run build
```

TypeScript で開発されており、`src/index.ts` を編集してください。ビルドすると `build/index.js` が更新されます。

## ライセンス

MIT

## Publish to npm for NPX usage on other machines

Follow these steps to publish so others can run it via `npx` without cloning:

1. Create/sign in to an npm account: [npmjs.com](https://www.npmjs.com/)
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
