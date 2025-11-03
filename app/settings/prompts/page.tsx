"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsCard } from "@/components/SettingsCard";

const promptSchema = z.object({
  accountId: z.string().min(1, "必須項目です"),
  displayName: z.string().min(1, "必須項目です"),
  persona: z.string().min(10, "10文字以上で入力してください"),
  rules: z.string().min(10, "10文字以上で入力してください"),
  rankingFormat: z.string().min(1, "ランキング形式は必須です"),
  testTopic: z.string().optional()
});

export default function PromptSettingsPage() {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      accountId: "creator-lab",
      displayName: "クリエイターズラボ",
      persona: "Z世代に刺さるトーンで、明るくテンポよく情報を伝えるMC",
      rules: "ランキングは必ずトップ5を提示し、各項目に15秒以内のナレーションを設定",
      rankingFormat: "Top5 / Hook -> Body -> CTA",
      testTopic: "今週のバズワード"
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatusMessage("保存中...");
    const res = await fetch("/api/settings/prompts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    setStatusMessage(data.message ?? "保存しました");
  });

  const onTest = async () => {
    setStatusMessage("OpenAIへテスト実行中...");
    const res = await fetch("/api/settings/prompts/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: watch("testTopic"),
        persona: watch("persona")
      })
    });
    const data = await res.json();
    setStatusMessage(data.preview ?? "テスト完了");
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{ gap: "1.5rem" }}>
      <SettingsCard
        title="OpenAI プロンプト設定"
        description="ランキング生成で利用する文脈とルールを定義します。"
        actions={
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={onTest} disabled={isSubmitting}>
              テスト実行
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "保存中" : "保存"}
            </button>
          </div>
        }
      >
        <div className="grid-2">
          <div className="input-group">
            <label htmlFor="accountId">アカウントID</label>
            <input id="accountId" placeholder="account-id" {...register("accountId")} />
            {errors.accountId && <span className="subtitle">{errors.accountId.message}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="displayName">表示名</label>
            <input id="displayName" placeholder="Generative Lab" {...register("displayName")} />
            {errors.displayName && <span className="subtitle">{errors.displayName.message}</span>}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="persona">キャラクター設定</label>
          <textarea id="persona" rows={3} {...register("persona")} />
          {errors.persona && <span className="subtitle">{errors.persona.message}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="rules">ルール</label>
          <textarea id="rules" rows={3} {...register("rules")} />
          {errors.rules && <span className="subtitle">{errors.rules.message}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="rankingFormat">ランキング形式</label>
          <textarea id="rankingFormat" rows={2} {...register("rankingFormat")} />
          {errors.rankingFormat && <span className="subtitle">{errors.rankingFormat.message}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="testTopic">テスト用トピック</label>
          <input id="testTopic" placeholder="例: 最新のビューティートレンド" {...register("testTopic")} />
        </div>
      </SettingsCard>
      {statusMessage && <p className="subtitle">{statusMessage}</p>}
    </form>
  );
}
