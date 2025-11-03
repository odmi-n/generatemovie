"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsCard } from "@/components/SettingsCard";

const notificationSchema = z.object({
  slackBotToken: z.string().min(1, "Slack Bot Tokenは必須です"),
  defaultChannel: z.string().min(1, "チャンネルIDを入力してください"),
  messageTemplate: z.string().min(10, "本文は10文字以上で入力してください"),
  emoji: z.string().optional(),
  mentionUser: z.string().optional()
});

type NotificationForm = z.infer<typeof notificationSchema>;

export default function NotificationSettingsPage() {
  const [statusMessage, setStatusMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      slackBotToken: "xoxb-SLACK_BOT_TOKEN",
      defaultChannel: "C0123456789",
      messageTemplate: "{{rankingTitle}} の最新動画が完成しました！ :camera_with_flash:",
      emoji: ":film_projector:",
      mentionUser: "@channel"
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatusMessage("保存中...");
    const res = await fetch("/api/settings/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    setStatusMessage(data.message ?? "保存しました");
  });

  const sendTest = async () => {
    setStatusMessage("Slackへテスト送信中...");
    const res = await fetch("/api/settings/notifications/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "C0123456789" })
    });
    const data = await res.json();
    setStatusMessage(data.message ?? "テスト送信しました");
  };

  return (
    <form onSubmit={onSubmit} className="grid" style={{ gap: "1.5rem" }}>
      <SettingsCard
        title="Slack 通知設定"
        description="Bot Token と投稿テンプレートを管理します。"
        actions={
          <div className="form-actions">
            <button type="button" className="button-secondary" onClick={sendTest} disabled={isSubmitting}>
              テスト送信
            </button>
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              {isSubmitting ? "保存中" : "保存"}
            </button>
          </div>
        }
      >
        <div className="input-group">
          <label htmlFor="slackBotToken">Slack Bot Token</label>
          <input id="slackBotToken" placeholder="xoxb-" {...register("slackBotToken")} />
          {errors.slackBotToken && <span className="subtitle">{errors.slackBotToken.message}</span>}
        </div>
        <div className="grid-2">
          <div className="input-group">
            <label htmlFor="defaultChannel">デフォルトチャンネルID</label>
            <input id="defaultChannel" placeholder="C0123456789" {...register("defaultChannel")} />
            {errors.defaultChannel && <span className="subtitle">{errors.defaultChannel.message}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="emoji">投稿絵文字</label>
            <input id="emoji" placeholder=":film_projector:" {...register("emoji")} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="mentionUser">メンション設定</label>
          <input id="mentionUser" placeholder="@channel" {...register("mentionUser")} />
        </div>
        <div className="input-group">
          <label htmlFor="messageTemplate">投稿テンプレート</label>
          <textarea id="messageTemplate" rows={3} {...register("messageTemplate")} />
          {errors.messageTemplate && <span className="subtitle">{errors.messageTemplate.message}</span>}
        </div>
      </SettingsCard>
      {statusMessage && <p className="subtitle">{statusMessage}</p>}
    </form>
  );
}
