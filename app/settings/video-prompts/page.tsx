"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsCard } from "@/components/SettingsCard";

const videoPromptSchema = z.object({
  templateName: z.string().min(1, "テンプレート名は必須です"),
  backgroundStyle: z.string().min(1, "背景スタイルは必須です"),
  sceneCount: z.coerce.number().min(3).max(10),
  bgmType: z.string().min(1, "BGMタイプは必須です"),
  textPlacement: z.enum(["top", "center", "bottom"]),
  notes: z.string().optional()
});

type VideoPromptForm = z.infer<typeof videoPromptSchema>;

export default function VideoPromptSettingsPage() {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<VideoPromptForm>({
    resolver: zodResolver(videoPromptSchema),
    defaultValues: {
      templateName: "default-v1",
      backgroundStyle: "Neon gradient with particle effects",
      sceneCount: 5,
      bgmType: "Future bass",
      textPlacement: "center",
      notes: "Hook scene uses animated subtitles"
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatusMessage("保存中...");
    const res = await fetch("/api/settings/video-prompts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    setStatusMessage(data.message ?? "保存しました");
  });

  const duplicateTemplate = () => {
    setStatusMessage(`テンプレート ${Date.now()} を複製しました (mock)`);
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{ gap: "1.5rem" }}>
      <SettingsCard
        title="kie.ai 動画プロンプト"
        description="背景、シーン構成、字幕位置など動画テンプレートを定義します。"
        actions={
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={duplicateTemplate}>
              テンプレートを複製
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "保存中" : "保存"}
            </button>
          </div>
        }
      >
        <div className="grid-2">
          <div className="input-group">
            <label htmlFor="templateName">テンプレート名</label>
            <input id="templateName" {...register("templateName")} />
            {errors.templateName && <span className="subtitle">{errors.templateName.message}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="sceneCount">シーン数</label>
            <input id="sceneCount" type="number" min={3} max={10} {...register("sceneCount")} />
            {errors.sceneCount && <span className="subtitle">シーン数は3〜10の範囲です</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="backgroundStyle">背景スタイル</label>
          <textarea id="backgroundStyle" rows={3} {...register("backgroundStyle")} />
          {errors.backgroundStyle && <span className="subtitle">{errors.backgroundStyle.message}</span>}
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label htmlFor="bgmType">BGMタイプ</label>
            <input id="bgmType" {...register("bgmType")} />
            {errors.bgmType && <span className="subtitle">{errors.bgmType.message}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="textPlacement">テキスト位置</label>
            <select id="textPlacement" {...register("textPlacement")}>
              <option value="top">上部</option>
              <option value="center">中央</option>
              <option value="bottom">下部</option>
            </select>
            {errors.textPlacement && <span className="subtitle">テキスト位置を選択してください</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="notes">補足メモ</label>
          <textarea id="notes" rows={3} placeholder="例: Hookシーンではダイナミックエフェクトを有効" {...register("notes")} />
        </div>
      </SettingsCard>
      {statusMessage && <p className="subtitle">{statusMessage}</p>}
    </form>
  );
}
