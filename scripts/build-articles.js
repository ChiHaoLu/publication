import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDirectory = path.join(process.cwd(), "src/content/articles");
const outputFile = path.join(process.cwd(), "src/content/articles.ts");

// Read all markdown files
const fileNames = fs.readdirSync(articlesDirectory);
const articles = fileNames
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      content: data.excerpt || content.slice(0, 150) + "...",
      markdown: content,
      date: data.date,
      tags: data.tags || [],
      isPinned: data.isPinned || false,
    };
  })
  .sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

// Generate the articles file
const fileContent = `// This file is auto-generated. Do not edit it directly.
import { Article } from '@/types/article';

export const articles: Article[] = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log("Articles built successfully!");
