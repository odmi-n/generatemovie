"use client";

import Link from "next/link";
import { useMemo } from "react";

const mockRankings = [
  {
    id: "trend-explorers",
    title: "Z世代トレンド速報",
    description: "週次のTikTokトレンドを要約した縦型動画",
    lastRun: "2024-04-18 09:30",
    totalVideos: 42,
    slackChannel: "#reels-z",
    status: "処理中"
  },
  {
    id: "wellness",
    title: "ウェルネス習慣ランキング",
    description: "朝活・フィットネスのベスト5を紹介",
    lastRun: "2024-04-17 21:10",
    totalVideos: 36,
    slackChannel: "#health-updates",
    status: "成功"
  }
];

export default function RankingsPage() {
  const items = useMemo(() => mockRankings, []);

  return (
    <section className="grid" style={{ gap: "2rem" }}>
      <header className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="section-title">ランキング管理</h1>
          <p className="subtitle">生成済みの動画とSlack投稿状況を素早く確認できます。</p>
        </div>
        <button className="button-primary">新規ランキング作成</button>
      </header>

      <div className="grid-2">
        {items.map((ranking) => (
          <article key={ranking.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>{ranking.title}</h2>
              <span className="badge">{ranking.status}</span>
            </div>
            <p className="subtitle">{ranking.description}</p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <div>
                <strong>Slack</strong>
                <p className="subtitle">{ranking.slackChannel}</p>
              </div>
              <div>
                <strong>生成本数</strong>
                <p className="subtitle">{ranking.totalVideos} 本</p>
              </div>
              <div>
                <strong>最終実行</strong>
                <p className="subtitle">{ranking.lastRun}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="button-secondary">詳細を見る</button>
              <button className="button-secondary">生成をトリガー</button>
              <Link className="button-secondary" href={`/rankings/${ranking.id}`}>
                動画履歴
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
