import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDirectory = path.join(process.cwd(), "src/content/articles");
const outputFile = path.join(process.cwd(), "src/content/articles.ts");

// Function to recursively get all markdown files
function getAllMarkdownFiles(dir, category = "") {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively get files from subdirectories
      const subCategory = category ? `${category}/${item}` : item;
      results = results.concat(getAllMarkdownFiles(fullPath, subCategory));
    } else if (item.endsWith(".md")) {
      results.push({
        path: fullPath,
        category: category,
        fileName: item,
      });
    }
  }

  return results;
}

// Get all markdown files recursively
const markdownFiles = getAllMarkdownFiles(articlesDirectory);

// Function to calculate text count excluding iframe content
function calculateTextCount(content) {
  // Remove iframe content
  const contentWithoutIframes = content.replace(
    /<iframe[\s\S]*?<\/iframe>/g,
    ""
  );
  // Remove HTML tags
  const plainText = contentWithoutIframes.replace(/<[^>]*>/g, "");
  // Count characters
  return plainText.length;
}

// Process all markdown files
const articles = markdownFiles
  .map(({ path: filePath, category, fileName }) => {
    const id = fileName.replace(/\.md$/, "");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      content: data.excerpt || content.slice(0, 150) + "...",
      markdown: content,
      date: data.date,
      tags: data.tags || [],
      isPinned: data.isPinned || false,
      textCount: calculateTextCount(content),
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
