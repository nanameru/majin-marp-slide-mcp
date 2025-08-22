#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "majin-marp-slide",
    version: "1.0.0"
});
const MarpPromptSchema = z.object({
    title: z.string().min(1),
    audience: z.string().optional(),
    pages: z.number().int().positive().optional(),
    style: z.enum(["tech", "business", "conference"]).optional(),
    language: z.enum(["ja", "en"]).default("ja").optional()
});
function buildMarpPrompt(args) {
    const { title, audience = "general", pages = 10, style = "tech", language = "ja", } = args;
    const localeHeader = language === "en"
        ? "# Marp Slide Generation Prompt"
        : "# Marp スライド生成プロンプト";
    const guidance = language === "en"
        ? `You are generating a complete slide deck in Marp Markdown for the topic "${title}".`
        : `あなたは Marp Markdown で「${title}」に関する完全なスライドデッキを作成します。`;
    const audienceLine = language === "en" ? `Target audience: ${audience}.` : `想定読者: ${audience}。`;
    const styleLine = language === "en" ? `Preferred style: ${style}.` : `想定スタイル: ${style}。`;
    const pagesLine = language === "en"
        ? `Approximate number of pages: ${pages}.`
        : `想定ページ数: 約 ${pages}。`;
    const sharedEn = `
- Use Marp-compatible Markdown with front matter
- Include a title slide, agenda, and conclusion
- Provide concise bullet points and speaker notes
- Use code blocks or diagrams when beneficial
- Keep each slide focused and readable
- Add a brief summary at the end of each section
`;
    const sharedJa = `
- Marp 互換のフロントマター付きMarkdownを使用
- タイトル、アジェンダ、まとめスライドを含める
- 箇条書きとスピーカーノートを簡潔に
- 必要に応じてコードブロックや図を使用
- 1スライド1メッセージで可読性を重視
- 各セクション末尾に短いサマリーを付ける
`;
    const frontMatter = `---
marp: true
paginate: true
theme: default
class: lead
---`;
    const agenda = `
## Agenda
- Overview
- Key Concepts
- Deep Dive
- Examples
- Summary
`;
    return `${localeHeader}

${guidance}
${audienceLine}
${styleLine}
${pagesLine}

${language === "en" ? sharedEn : sharedJa}

${frontMatter}

# ${title}

<!-- Agenda -->
${agenda}

<!-- Guidance for sections and speaker notes -->
${language === "en" ? `
- For each slide, include: concise bullets (3-5 lines) and optional speaker notes under "Notes:".
- Suggested structure:
  - Overview: 1-2 slides
  - Key Concepts: 3-5 slides
  - Deep Dive: 4-8 slides
  - Examples/Demos: 2-4 slides
  - Summary & Next Steps: 1 slide
- Insert code blocks using fenced Markdown when appropriate.
- Prefer descriptive headers; avoid long paragraphs.
` : `
- 各スライドは箇条書き（3〜5行）と、必要なら「Notes:」以降にスピーカーノートを含めてください。
- 推奨構成：
  - 概要: 1〜2枚
  - 主要概念: 3〜5枚
  - 詳細解説: 4〜8枚
  - 事例/デモ: 2〜4枚
  - まとめ/次のアクション: 1枚
- 必要に応じてコードブロックを使用し、段落は短く保つこと。
`}
`;
}
server.tool("marp_prompt", "Return a high-quality prompt for generating a Marp slide deck", MarpPromptSchema.shape, (args) => {
    const prompt = buildMarpPrompt(args);
    return { content: [{ type: "text", text: prompt }] };
});
const transport = new StdioServerTransport();
await server.connect(transport);
