import fs from "node:fs";
import path from "node:path";

const docsRoot = path.resolve("docs");
const publicRoot = path.join(docsRoot, ".vuepress", "public");
const markdownFiles = [];
const textFiles = [];
const placeholderPatterns = [
  /\bTODO\b/i,
  /^#+\s*标题[一二三四五六七八九十]+/m,
  /这是文章的标题/,
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".cache", ".temp", "dist", "node_modules"].includes(entry.name)) continue;
      walk(full);
      continue;
    }

    if (/\.(?:md|ts|js|scss|json)$/i.test(entry.name)) textFiles.push(full);
    if (entry.name.endsWith(".md")) markdownFiles.push(full);
  }
}

function withoutFrontmatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---(?:\n|$)/, "\n");
}

function withoutCode(text) {
  const lines = text.split("\n");
  const output = [];
  let fence = null;

  for (const line of lines) {
    const opening = line.match(/^\s*(`{3,}|~{3,})/);

    if (!fence && opening) {
      fence = { marker: opening[1][0], length: opening[1].length };
      output.push("");
      continue;
    }

    if (fence) {
      const closing = line.match(/^\s*(`{3,}|~{3,})\s*$/);
      if (
        closing &&
        closing[1][0] === fence.marker &&
        closing[1].length >= fence.length
      ) {
        fence = null;
      }
      output.push("");
      continue;
    }

    output.push(line);
  }

  return output
    .join("\n")
    .replace(/(`+)(?:(?!\1)[\s\S])*?\1/g, "``");
}

function normalizedLinkTarget(rawTarget) {
  const target = rawTarget.trim();
  const wrapped = target.match(/^<([^>]+)>/);
  const unwrapped = wrapped ? wrapped[1] : target.match(/^(\S+)/)?.[1] ?? "";

  try {
    return decodeURIComponent(unwrapped);
  } catch {
    return unwrapped;
  }
}

function candidatesForRoute(sourceFile, rawTarget) {
  const clean = normalizedLinkTarget(rawTarget).split("#")[0].split("?")[0];
  if (!clean) return [sourceFile];

  if (clean.startsWith("/")) {
    const route = clean.replace(/^\//, "");
    return [
      path.join(docsRoot, route),
      path.join(docsRoot, route.replace(/\.html$/, ".md")),
      path.join(docsRoot, route, "README.md"),
      path.join(publicRoot, route),
    ];
  }

  const resolved = path.resolve(path.dirname(sourceFile), clean);
  return [
    resolved,
    `${resolved}.md`,
    path.join(resolved, "README.md"),
    path.join(resolved, "index.md"),
    path.join(resolved.replace(/\.html$/, ".md")),
  ];
}

function fileExistsForRoute(sourceFile, target) {
  return candidatesForRoute(sourceFile, target).some((candidate) =>
    fs.existsSync(candidate),
  );
}

const sensitivePatterns = [
  { name: "手机号", regex: /(?<!\d)1[3-9]\d{9}(?!\d)/g },
  { name: "脱敏手机号", regex: /1[3-9]\d{2}\*{4}\d{4}/g },
  { name: "身份证号", regex: /(?<!\d)\d{17}[0-9Xx](?!\d)/g },
  {
    name: "银行卡号",
    regex: /(?:卡号|card(?: number)?)[^\d]{0,8}(?<!\d)\d{16,19}(?!\d)/gi,
  },
  {
    name: "邮箱地址",
    regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
  },
  {
    name: "私钥",
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
  {
    name: "明文助记词",
    regex: /(?:mnemonic|seed phrase)\s*[:=]\s*["'][a-z]+(?:\s+[a-z]+){11,}["']/gi,
  },
];

walk(docsRoot);

const errors = [];
const warnings = [];
let linkCount = 0;

for (const file of textFiles) {
  const rel = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");

  for (const { name, regex } of sensitivePatterns) {
    regex.lastIndex = 0;
    if (regex.test(text)) {
      errors.push(`${rel}: 检测到疑似敏感信息（${name}）`);
    }
  }
}

for (const file of markdownFiles) {
  const rel = path.relative(process.cwd(), file);
  const text = fs.readFileSync(file, "utf8");
  const body = withoutCode(withoutFrontmatter(text));
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatter) {
    errors.push(`${rel}: 缺少 frontmatter`);
  } else if (!/^title:\s*.+/m.test(frontmatter[1])) {
    errors.push(`${rel}: frontmatter 缺少 title`);
  }

  const h1Count = (body.match(/^# /gm) || []).length;
  if (h1Count > 1) warnings.push(`${rel}: 存在 ${h1Count} 个一级标题`);

  for (const pattern of placeholderPatterns) {
    if (pattern.test(body)) {
      warnings.push(`${rel}: 疑似占位内容 ${pattern}`);
      break;
    }
  }

  for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = normalizedLinkTarget(match[1]);
    if (!target || /^(https?:|mailto:|tel:|#)/i.test(target)) continue;
    linkCount += 1;
    if (!fileExistsForRoute(file, target)) {
      errors.push(`${rel}: 内部链接不存在 -> ${target}`);
    }
  }
}

console.log(
  `Checked ${markdownFiles.length} Markdown files and ${linkCount} internal links.`,
);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Document validation passed.");
