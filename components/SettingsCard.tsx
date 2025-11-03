"use client";

import type { ReactNode } from "react";

export function SettingsCard({
  title,
  description,
  children,
  actions
}: {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h2>
          <p className="subtitle" style={{ marginTop: "0.4rem" }}>
            {description}
          </p>
        </div>
        {actions && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>{actions}</div>}
      </header>
      {children}
    </section>
  );
}
