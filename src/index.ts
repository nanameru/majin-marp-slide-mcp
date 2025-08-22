#!/usr/bin/env node
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

type SupportedStyle = "tech" | "business" | "conference";
type SupportedLanguage = "ja" | "en";

type MarpPromptArgs = {
  title: string;
  audience?: string;
  pages?: number;
  style?: SupportedStyle;
  language?: SupportedLanguage;
};

function assertValidArgs(input: unknown): asserts input is MarpPromptArgs {
  const candidate = input as Record<string, unknown>;
  if (!candidate || typeof candidate !== "object") {
    throw new Error("Input must be an object");
  }
  if (typeof candidate.title !== "string" || candidate.title.trim().length === 0) {
    throw new Error("'title' is required and must be a non-empty string");
  }
  if (candidate.audience !== undefined && typeof candidate.audience !== "string") {
    throw new Error("'audience' must be a string if provided");
  }
  if (candidate.pages !== undefined) {
    if (typeof candidate.pages !== "number" || !Number.isFinite(candidate.pages) || candidate.pages <= 0) {
      throw new Error("'pages' must be a positive number if provided");
    }
  }
  if (candidate.style !== undefined) {
    const allowed: SupportedStyle[] = ["tech", "business", "conference"];
    if (typeof candidate.style !== "string" || !allowed.includes(candidate.style as SupportedStyle)) {
      throw new Error("'style' must be one of: tech, business, conference");
    }
  }
  if (candidate.language !== undefined) {
    const allowedLang: SupportedLanguage[] = ["ja", "en"];
    if (typeof candidate.language !== "string" || !allowedLang.includes(candidate.language as SupportedLanguage)) {
      throw new Error("'language' must be one of: ja, en");
    }
  }
}

function buildMarpPrompt(args: MarpPromptArgs): string {
  const {
    title,
    audience = "general",
    pages = 10,
    style = "tech",
    language = "ja",
  } = args;

  const localeHeader =
    language === "en"
      ? "# Marp Slide Generation Prompt"
      : "# Marp スライド生成プロンプト";

  const guidance =
    language === "en"
      ? `You are generating a complete slide deck in Marp Markdown for the topic "${title}".`
      : `あなたは Marp Markdown で「${title}」に関する完全なスライドデッキを作成します。`;

  const audienceLine =
    language === "en" ? `Target audience: ${audience}.` : `想定読者: ${audience}。`;

  const styleLine =
    language === "en" ? `Preferred style: ${style}.` : `想定スタイル: ${style}。`;

  const pagesLine =
    language === "en"
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

const tools: Tool[] = [
  {
    name: "marp_prompt",
    description: "Return a high-quality prompt for generating a Marp slide deck",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Slide deck title (required)" },
        audience: { type: "string", description: "Intended audience" },
        pages: { type: "number", description: "Approximate number of pages" },
        style: {
          type: "string",
          enum: ["tech", "business", "conference"],
          description: "Presentation style variant"
        },
        language: {
          type: "string",
          enum: ["ja", "en"],
          default: "ja",
          description: "Prompt language"
        }
      },
      required: ["title"]
    },
    handler: async (input) => {
      assertValidArgs(input);
      const prompt = buildMarpPrompt(input);
      return { content: [{ type: "text", text: prompt }] };
    }
  }
];

const server = new Server(
  {
    name: "majin-marp-slide",
    version: "1.0.0"
  },
  { capabilities: { tools: {} } }
);

for (const tool of tools) {
  server.tool(tool);
}

const transport = new StdioServerTransport();

try {
  await server.connect(transport);
} catch (error) {
  console.error("Failed to start majin-marp-slide:", error);
  process.exit(1);
}
