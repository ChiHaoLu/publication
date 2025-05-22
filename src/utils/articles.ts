import { Article } from "@/types/article";
import { articles as articlesData } from "@/content/articles";

// This will be populated at build time
let articlesCache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (articlesCache) {
    return articlesCache;
  }

  articlesCache = articlesData;
  return articlesData;
}

export function getArticleById(id: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.id === id) || null;
}
