"use client";

import { useState, useMemo } from "react";
import ArticleCard from "@/components/ArticleCard";
import styles from "./page.module.css";
import { getAllArticles } from "@/utils/articles";
import { calculateStats } from "@/utils/stats";

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "textCount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const articlesPerPage = 10;

  const articles = useMemo(() => getAllArticles(), []);
  const stats = useMemo(() => calculateStats(), []);

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
      })
      .sort((a, b) => {
        const order = sortOrder === "asc" ? 1 : -1;
        switch (sortBy) {
          case "date":
            return (
              order * (new Date(a.date).getTime() - new Date(b.date).getTime())
            );
          case "textCount":
            return order * (a.textCount - b.textCount);
          default:
            return 0;
        }
      });
  }, [articles, selectedTags, dateRange, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
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
        <div className={styles.sortControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "textCount")}
            className={styles.sortSelect}
          >
            <option value="date">Date</option>
            <option value="textCount">Text Count</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className={styles.sortOrderButton}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <div className={styles.dateFilters}>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => {
              setDateRange((prev) => ({ ...prev, start: e.target.value }));
              setCurrentPage(1); // Reset to first page when date changes
            }}
            className={styles.dateInput}
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => {
              setDateRange((prev) => ({ ...prev, end: e.target.value }));
              setCurrentPage(1); // Reset to first page when date changes
            }}
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
              #{tag} ({stats.tagDistribution.find((t) => t.tag === tag)?.count})
            </button>
          ))}
        </div>
      </div>
      <div className={styles.articles}>
        <iframe
          height="450"
          width="100%"
          title="媒體播放器"
          src="https://embed.podcasts.apple.com/us/podcast/simple-dog/id1812055953?l=zh-Hant-TW&amp;itscg=30200&amp;itsct=podcast_box_player&amp;ls=1&amp;mttnsubad=1812055953&amp;theme=auto"
          id="embedPlayer"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay *; encrypted-media *; clipboard-write"
          style={{
            border: "0px",
            borderRadius: "12px",
            width: "100%",
            height: "450px",
            maxWidth: "660px",
          }}
        />
        {currentArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPinToggle={handlePinToggle}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
