import { Article } from "@/types/article";
import styles from "./ArticleCard.module.css";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
  onPinToggle: (id: string) => void;
}

export default function ArticleCard({
  article,
  onPinToggle,
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Link href={`/article/${article.id}`} className={styles.titleLink}>
          <h2>{article.title}</h2>
        </Link>
        <button
          onClick={() => onPinToggle(article.id)}
          className={`${styles.pinButton} ${
            article.isPinned ? styles.pinned : ""
          }`}
          aria-label={article.isPinned ? "Unpin article" : "Pin article"}
        >
          📌
        </button>
      </div>
      <p className={styles.date}>{formatDate(article.date)}</p>
      <p className={styles.content}>{article.content}</p>
      <div className={styles.tags}>
        {article.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
