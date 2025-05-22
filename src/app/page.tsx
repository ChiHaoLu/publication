"use client";

import { useState, useMemo } from "react";
import ArticleCard from "@/components/ArticleCard";
import styles from "./page.module.css";
import { getAllArticles } from "@/utils/articles";

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const articles = useMemo(() => getAllArticles(), []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        if (selectedTags.length === 0) return true;
        return selectedTags.every((tag) => article.tags.includes(tag));
      })
      .filter((article) => {
        if (!dateRange.start && !dateRange.end) return true;
        const articleDate = new Date(article.date);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;

        if (start && end) {
          return articleDate >= start && articleDate <= end;
        } else if (start) {
          return articleDate >= start;
        } else if (end) {
          return articleDate <= end;
        }
        return true;
      });
  }, [articles, selectedTags, dateRange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePinToggle = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) {
      article.isPinned = !article.isPinned;
      // Force re-render
      setSelectedTags([...selectedTags]);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.filters}>
        <div className={styles.dateFilters}>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className={styles.dateInput}
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className={styles.dateInput}
          />
        </div>
        <div className={styles.tagFilters}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`${styles.tagButton} ${
                selectedTags.includes(tag) ? styles.selected : ""
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.articles}>
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPinToggle={handlePinToggle}
          />
        ))}
      </div>
    </main>
  );
}
