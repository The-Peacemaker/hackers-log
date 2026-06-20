import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { getSingletonHighlighter, Highlighter } from 'shiki';
import katex from 'katex';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const logsDirectory = path.join(process.cwd(), 'content/logs');
const projectsFile = path.join(process.cwd(), 'content/projects.json');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string;
  categories: string[];
  tags: string[];
  readingTime: string;
  summary: string;
  contentHtml: string;
  toc: { id: string; text: string; level: number }[];
}

export interface LogData {
  id: string;
  date: string;
  contentHtml: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  link?: string;
  github?: string;
}

let shikiHighlighter: Highlighter | null = null;

async function getShiki() {
  if (!shikiHighlighter) {
    shikiHighlighter = await getSingletonHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript', 'rust', 'go', 'html', 'css', 'http', 'shell', 'json', 'bash']
    });
  }
  return shikiHighlighter;
}

function renderMath(content: string): string {
  // Display math: $$...$$
  let result = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => {
    try {
      return katex.renderToString(eq.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<div class="katex-error">${eq}</div>`;
    }
  });
  // Inline math: $...$ (avoiding $$ cases already handled)
  result = result.replace(/(?<!\$)\$([^\n$]+?)\$(?!\$)/g, (_, eq) => {
    try {
      return katex.renderToString(eq.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `$${eq}$`;
    }
  });
  return result;
}

// Compile custom elements: Callouts & Footnotes
async function parseAndHighlight(markdownContent: string): Promise<{ html: string; toc: { id: string; text: string; level: number }[] }> {
  const toc: { id: string; text: string; level: number }[] = [];
  const footnotes: { id: string; text: string }[] = [];

  // 0. Render KaTeX math before other processing
  let processed = renderMath(markdownContent);

  // 1. Parse callouts :::type\n content \n:::
  processed = processed.replace(/:::(insight|warning|experiment|interesting)\r?\n([\s\S]*?)\r?\n:::/g, (match, type, content) => {
    return `<div class="callout callout-${type}"><div class="callout-title">${type}</div><div class="callout-content">${content}</div></div>`;
  });

  // 2. Extract Footnote Definitions: [^1]: Text
  processed = processed.replace(/^\[\^(\d+)\]:\s*(.*)$/gm, (match, id, text) => {
    footnotes.push({ id, text });
    return ''; // Remove from main body
  });

  // 3. Process Footnote References in text: [^1]
  processed = processed.replace(/\[\^(\d+)\]/g, (match, id) => {
    return `<a href="#fn-${id}" id="fnref-${id}" class="footnote-ref">${id}</a>`;
  });

  const markedInstance = new Marked();
  const highlighter = await getShiki();

  // Create marked renderer overrides
  const renderer = {
    // Custom heading rendering to generate TOC
    heading(token: { text: string; depth: number }) {
      const escapedText = token.text.toLowerCase().replace(/[^\w]+/g, '-');
      toc.push({ id: escapedText, text: token.text, level: token.depth });
      return `<h${token.depth} id="${escapedText}">${token.text}</h${token.depth}>`;
    },
    // Custom code block rendering using Shiki
    code(token: { text: string; lang?: string }) {
      const lang = token.lang || 'text';
      const code = token.text;
      try {
        const lightHtml = highlighter.codeToHtml(code, { lang, theme: 'github-light' });
        const darkHtml = highlighter.codeToHtml(code, { lang, theme: 'github-dark' });
        
        // Wrap in a layout with light/dark variants hidden/shown via tailwind
        return `
          <div class="relative group my-6 border border-border rounded-lg overflow-hidden font-mono text-sm leading-relaxed">
            <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-background text-[11px] text-secondary-foreground uppercase tracking-widest font-mono">
              <span>${lang}</span>
              <button 
                class="copy-code-btn transition-colors hover:text-foreground flex items-center" 
                data-code="${encodeURIComponent(code)}"
              >
                <span class="nf nf-fa-copy mr-1"></span>Copy
              </button>
            </div>
            <div class="shiki-light dark:hidden p-4 overflow-x-auto bg-[#FAFAF8]">
              ${lightHtml}
            </div>
            <div class="shiki-dark hidden dark:block p-4 overflow-x-auto bg-[#0d1117]">
              ${darkHtml}
            </div>
          </div>
        `;
      } catch (err) {
        // Fallback
        return `<pre class="my-6 border border-border rounded-lg p-4 bg-background overflow-x-auto"><code class="language-${lang}">${code}</code></pre>`;
      }
    }
  };

  markedInstance.use({ renderer });
  let html = await markedInstance.parse(processed);

  // 4. Append Footnotes at the bottom if any exist
  if (footnotes.length > 0) {
    let footnotesHtml = `<div class="footnotes"><ol>`;
    footnotes.forEach(fn => {
      footnotesHtml += `<li id="fn-${fn.id}">${fn.text} <a href="#fnref-${fn.id}" class="footnote-backref">↩</a></li>`;
    });
    footnotesHtml += `</ol></div>`;
    html += footnotesHtml;
  }

  return { html, toc };
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);
  const { html, toc } = await parseAndHighlight(content);

  const rawCat = data.category;
  const categories = Array.isArray(rawCat) ? rawCat : [rawCat || 'Uncategorized'];

  return {
    slug,
    title: data.title,
    date: data.date,
    category: categories[0],
    categories,
    tags: data.tags || [],
    readingTime: data.readingTime || '5 min read',
    summary: data.summary || '',
    contentHtml: html,
    toc
  };
}

export async function getAllPosts(): Promise<Omit<PostData, 'contentHtml' | 'toc'>[]> {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        const rawCat = data.category;
        const categories = Array.isArray(rawCat) ? rawCat : [rawCat || 'Uncategorized'];

        return {
          slug,
          title: data.title,
          date: data.date,
          category: categories[0],
          categories,
          tags: data.tags || [],
          readingTime: data.readingTime || '5 min read',
          summary: data.summary || ''
        };
      })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllLogs(): Promise<LogData[]> {
  if (!fs.existsSync(logsDirectory)) return [];
  const fileNames = fs.readdirSync(logsDirectory);
  const markedInstance = new Marked();

  const logs = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(logsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data, content } = matter(fileContents);
        const contentHtml = await markedInstance.parse(content);

        return {
          id,
          date: data.date,
          contentHtml
        };
      })
  );

  return logs.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjects(): ProjectData[] {
  if (!fs.existsSync(projectsFile)) return [];
  const fileContents = fs.readFileSync(projectsFile, 'utf8');
  return JSON.parse(fileContents);
}
