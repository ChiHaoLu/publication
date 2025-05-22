import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "うさみのまいにち社会",
  description: "なんとなく気になる、あの話題。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.authorInfo}>
              <div className={styles.avatarContainer}>
                <Image
                  src={`${
                    process.env.NEXT_PUBLIC_BASE_URL || ""
                  }/images/Alfred.jpg`}
                  alt="Author avatar"
                  width={120}
                  height={120}
                  className={styles.avatar}
                  priority
                />
              </div>
              <h2>うさみ</h2>
              <p>Not a complete person. But a complete rabbit.</p>
              <div className={styles.socialLinks}>
                <div className={styles.podcastPlayer}>
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/episode/7IjM8dM1v3hMxcLW0VtRyj?utm_source=generator"
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
                <a
                  href="https://www.chihaolu.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  💰 What I am Doing
                </a>
                <a
                  href="https://www.youtube.com/@simple-retriever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  🐶 Podcast - SimpleDog (Updating)
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  🥵 Podcast - 隨便亂 Lu (Discontinued)
                </a>
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
