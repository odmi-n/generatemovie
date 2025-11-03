"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsCard } from "@/components/SettingsCard";

const styleSchema = z.object({
  titleColor: z.string().min(1, "タイトル色を入力してください"),
  bodyColor: z.string().min(1, "本文色を入力してください"),
  borderColor: z.string().min(1, "枠線色を入力してください"),
  ctaText: z.string().min(1, "CTAテキストは必須です"),
  insertPromoVideo: z.boolean(),
  promoVideoUrl: z.string().optional()
});

type StyleForm = z.infer<typeof styleSchema>;

export default function RankingVideoStylePage() {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<StyleForm>({
    resolver: zodResolver(styleSchema),
    defaultValues: {
      titleColor: "#ffffff",
      bodyColor: "#cbd5f5",
      borderColor: "#6366f1",
      ctaText: "今すぐチェック",
      insertPromoVideo: true,
      promoVideoUrl: "https://example.com/promo.mp4"
    }
  });

  const borderColor = watch("borderColor");
  const bodyColor = watch("bodyColor");
  const titleColor = watch("titleColor");

  const onSubmit = handleSubmit(async (values) => {
    setStatusMessage("保存中...");
    const res = await fetch("/api/settings/ranking-video-style", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    setStatusMessage(data.message ?? "保存しました");
  });

  const handlePromoToggle = () => {
    setValue("insertPromoVideo", !watch("insertPromoVideo"));
  };

  const handleUpload = () => {
    setStatusMessage("訴求動画をアップロードしました (mock)");
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{ gap: "1.5rem" }}>
      <SettingsCard
        title="ランキング動画編集設定"
        description="色、CTA、訴求動画の挿入を管理します。"
        actions={
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={handleUpload}>
              訴求動画をアップロード
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "保存中" : "保存"}
            </button>
          </div>
        }
      >
        <div className="grid-2">
          <div className="input-group">
            <label htmlFor="titleColor">タイトル文字色</label>
            <input id="titleColor" type="color" {...register("titleColor")} />
            {errors.titleColor && <span className="subtitle">{errors.titleColor.message}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="bodyColor">本文色</label>
            <input id="bodyColor" type="color" {...register("bodyColor")} />
            {errors.bodyColor && <span className="subtitle">{errors.bodyColor.message}</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="borderColor">枠線色</label>
          <input id="borderColor" type="color" {...register("borderColor")} />
          {errors.borderColor && <span className="subtitle">{errors.borderColor.message}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="ctaText">CTA テキスト</label>
          <input id="ctaText" placeholder="今すぐチェック" {...register("ctaText")} />
          {errors.ctaText && <span className="subtitle">{errors.ctaText.message}</span>}
        </div>

        <div className="input-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" checked={watch("insertPromoVideo")} onChange={handlePromoToggle} />
            訴求動画を挿入する (5秒まで)
          </label>
          {watch("insertPromoVideo") && (
            <input
              placeholder="https://example.com/promo.mp4"
              {...register("promoVideoUrl")}
            />
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: "0.75rem" }}>プレビュー</h3>
          <div
            className="video-frame"
            style={{
              borderColor,
              borderWidth: "2px",
              borderStyle: "solid",
              color: bodyColor,
              flexDirection: "column",
              gap: "0.5rem"
            }}
          >
            <span style={{ color: titleColor, fontWeight: 700 }}>CTAサンプル</span>
            <span style={{ fontSize: "0.85rem" }}>{watch("ctaText")}</span>
          </div>
        </div>
      </SettingsCard>
      {statusMessage && <p className="subtitle">{statusMessage}</p>}
    </form>
  );
}
