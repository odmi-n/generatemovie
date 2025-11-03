"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const tabs = [
  { href: "/settings/prompts", label: "プロンプト設定" },
  { href: "/settings/video-prompts", label: "動画プロンプト設定" },
  { href: "/settings/notifications", label: "通知設定" },
  { href: "/settings/ranking-video-style", label: "ランキング動画編集設定" }
];

export default function SettingsLayout({
  children
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <section className="tab-layout">
      <aside className="tab-nav card">
        <header style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <strong>アカウント設定</strong>
          <span className="subtitle">APIキーとテンプレートを管理します</span>
        </header>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`button-secondary${pathname === tab.href ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="section-title">設定</h1>
            <p className="subtitle">OpenAI / kie.ai / Slack の設定を個別にカスタマイズ</p>
          </div>
          <span className="badge">自動保存 ON</span>
        </header>
        {children}
      </div>
    </section>
  );
}
