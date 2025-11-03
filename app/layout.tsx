import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative Reels Studio",
  description: "Auto-generate Instagram Reels with OpenAI and kie.ai"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header style={{ padding: "1.5rem 2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1.5rem"
            }}
          >
            <Link href="/rankings" style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Generative Reels Studio
            </Link>
            <nav style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/rankings" className="button-secondary">
                ランキング
              </Link>
              <Link href="/settings/prompts" className="button-secondary">
                設定
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
