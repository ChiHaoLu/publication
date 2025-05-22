import { articles } from "@/content/articles";

export interface PublicationStats {
  totalArticles: number;
  totalWordCount: number;
  tagDistribution: {
    tag: string;
    count: number;
  }[];
}

export function calculateStats(): PublicationStats {
  // Calculate total articles
  const totalArticles = articles.length;

  // Calculate total word count
  const totalWordCount = articles.reduce(
    (sum, article) => sum + article.textCount,
    0
  );

  // Calculate tag distribution
  const tagCounts = new Map<string, number>();
  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const tagDistribution = Array.from(tagCounts.entries()).map(
    ([tag, count]) => ({
      tag,
      count,
    })
  );

  return {
    totalArticles,
    totalWordCount,
    tagDistribution,
  };
}
