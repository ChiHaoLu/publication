import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import Link from "next/link";
import { getArticleById } from "@/utils/articles";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return <div className={styles.notFound}>Article not found</div>;
  }

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.backLink}>
        ← Back to Articles
      </Link>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{article.title}</h1>
          <p className={styles.date}>{article.date}</p>
          <div className={styles.tags}>
            {article.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </header>
        <div className={styles.content}>
          <ReactMarkdown>{article.markdown}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
