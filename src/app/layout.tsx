import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import PublicationStats from "@/components/PublicationStats";
import { calculateStats } from "@/utils/stats";

export const metadata: Metadata = {
  title: "うさみのまいにち社会",
  description: "なんとなく気になる、あの話題。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stats = calculateStats();

  return (
    <html lang="en">
      <body className="antialiased">
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.authorInfo}>
              <div className={styles.avatarContainer}>
                <img
                  src={
                    "https://lh3.googleusercontent.com/a/ACg8ocJjCgU2uKr8lfhz19t7Tpa5R4WBSQSyU0ZP0hp6P5HikIE8Zzw=s576-c-no"
                  }
                  alt="Author avatar"
                  width={150}
                  height={150}
                  className={styles.avatar}
                />
              </div>
              <h2>うさみ</h2>
              <p>Not a complete person. But a complete rabbit.</p>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.chihaolu.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  💰 How do I make a living
                </a>
                <div className={styles.podcastPlayer}>
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/track/3zLG8d7B0IPVOzCfGEgLhV?utm_source=generator"
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
                <PublicationStats stats={stats} />
              </div>
            </div>
          </aside>
          <main className={styles.main}>
            <header className={styles.header}>
              <h1>うさみのまいにち社会</h1>
              <p className={styles.subtitle}>なんとなく気になる、あの話題。</p>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
