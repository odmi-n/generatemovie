# Generative Instagram Reels Platform Requirements

## 概要
- OpenAI APIとkie.ai APIを組み合わせ、縦型のInstagramリール動画を自動生成・無限配信するサービス。
- フロントエンドはNext.js (App Router) + TypeScriptで構築し、ランキング管理とアカウント設定の2画面を提供。
- バックエンドはNext.js Route Handlers(サーバーレスAPI) + Edge/Serverless Functionsで構成し、Vercel上に統合デプロイする。
- 動画生成ジョブは非同期ワークフローで管理し、生成完了時にはSlackチャンネルへ自動投稿する。

## 目的と非目的
- **目的**: ユーザーがランキングタイトルと生成プロンプトを設定し、OpenAI + kie.aiによる動画生成とSlack通知を自動化できる環境を提供する。ランキングごとの生成状況を把握し、プロンプト調整で訴求力を改善できるよう支援する。
- **非目的**: Instagramへの自動投稿や課金機能、SNS分析ダッシュボードの提供は範囲外。Slack以外の通知チャネルは将来拡張とする。

## 想定ユーザーと主要ユースケース
1. **マーケター/クリエイター**: ランキングテーマを定義し、生成された動画をSlackで確認しながら訴求パターンを改善する。
2. **SNS運用チーム**: チーム用Slackチャンネルに自動投稿された動画を確認し、利用価値が高いものを選定してInstagram運用に活用する。

### 代表的なユーザーフロー
1. アカウント設定画面でOpenAI/kie.ai APIキー、Slack通知先、プロンプト/動画スタイル設定を保存する。
2. ランキングタイトルを作成し、生成対象や保持ポリシーを設定する。
3. スケジュールまたは手動で動画生成ジョブが起動し、OpenAI→kie.aiのパイプラインを実行する。
4. 動画が生成されるとストレージに保存され、Slack API経由で指定チャンネルへ投稿される。ランキング画面から履歴と状態を確認する。

## システム構成
- **フロントエンド**: Next.js (App Router) + TypeScript + Tailwind CSS。動画プレビュー、ランキングカード、設定フォームを提供。
- **バックエンド/ジョブ実行**:
  - Next.js Route Handlersを用いたREST/tRPCエンドポイント。
  - Vercel Serverless Functions + Edge FunctionsでSlack通知やWebhook処理を実装。
  - Vercel CronとUpstash Redis/KVを利用した非同期ジョブとレート制御。
- **データベース/永続ストア**:
  - 基本構成ではSupabase(PostgreSQL) + Prisma。
- **ストレージ**: Vercel Blob StorageまたはS3互換ストレージに動画・サムネイルを保存。
- **外部サービス**: OpenAI API、kie.ai API、Slack Web API (chat.postMessage, files.upload)。

## データベース設計に関する検討
- **データベースを利用する理由**:
  - ユーザーごとのAPIキーやSlackチャンネル設定、動画テンプレート設定を安全に永続化する。
  - 動画生成ジョブの状態管理(再試行、失敗ログ)を行い、Slack投稿後でも履歴を追跡できる。
  - ランキングと動画資産の紐付けを保持し、ランキング画面での表示を安定させる。

## データモデル (DB利用構成)
- `User`: 認証情報、APIキー(暗号化)、Slackワークスペース情報。
- `PromptProfile`: OpenAIプロンプト設定。ランキング生成用のテンプレートやバリエーション。
- `VideoPromptProfile`: kie.ai用の動画プロンプト設定。背景、シーン、テキスト、尺など。
- `Ranking`: ランキングタイトル、説明、最大生成本数、関連プロンプトプロフィール。
- `VideoJob`: ステータス(queue/processing/completed/failed)、OpenAIレスポンス、kie.aiジョブID、Slack投稿結果。
- `VideoAsset`: 動画URL、サムネイル、生成日時、紐づくランキングID、SlackメッセージID。

## API要件
- `POST /api/auth/*`: NextAuthを用いた認証・セッション維持。
- `GET/PUT /api/settings/api-keys`: OpenAI/kie.ai APIキーの登録、マスク表示、疎通テスト。
- `GET/PUT /api/settings/prompt`: OpenAIプロンプト設定の取得・保存。
- `GET/PUT /api/settings/video-prompt`: kie.ai動画プロンプト設定の取得・保存。
- `GET/PUT /api/settings/notification`: SlackチャンネルID、トークン、投稿テンプレートの保存・テスト投稿。
- `GET/PUT /api/settings/ranking-video-style`: タイトル色、本文色、訴求動画挿入設定などkie.ai向けパラメータの管理。
- `GET/POST /api/rankings`: ランキングのCRUD。
- `GET /api/rankings/{id}/videos`: ランキング動画のページング取得(SlackメッセージIDとリンクを含む)。
- `POST /api/videos/generate`: 手動生成トリガー。即時Slack投稿のオプション。
- `POST /api/webhooks/kie-ai`: kie.aiからのレンダリング完了通知処理。完了後にSlack投稿を実施。
- `GET /api/jobs/{id}`: ジョブステータス確認。

## 動画生成・Slack投稿ワークフロー
1. **ジョブ生成**: Vercel Cronまたはユーザー操作でジョブを作成し、ランキング設定・プロンプト設定を解決してキューへ投入。
2. **OpenAIフェーズ**: ランキング生成プロンプト(OpenAI APIキーを使用)からシナリオJSONを取得。スクリプト、シーン構成、CTAなどを含める。
3. **kie.aiフェーズ**: 動画プロンプト設定 + ランキング動画編集設定(kie.ai APIキーを使用)を合成し、kie.aiへレンダリングリクエスト。
4. **完成通知**: kie.aiのWebhook受信後、動画をストレージへ保存し、必要に応じて訴求動画を結合。Slack投稿用の本文・添付を準備。
5. **Slack投稿**: Slack Web API `chat.postMessage`でチャンネルへ投稿し、必要に応じて`files.upload`で動画を添付。投稿IDを保存してランキング画面に反映。失敗時はリトライと通知。

## フロントエンド仕様
### 共通
- `/rankings`と`/settings`の2画面構成。App Routerでルーティングし、middlewareで認証済ユーザーに限定。
- UI: Tailwind CSS + Headless UI。9:16の動画プレビューコンポーネント、Slack投稿状況バッジなどを提供。

### `/rankings`
- ランキング一覧カード(タイトル、生成数、Slack投稿件数、最終更新日時、ステータスバッジ)。
- 「新規ランキング作成」モーダル(タイトル、説明、関連プロンプトプロフィール選択、Slack投稿有無)。
- 詳細モーダルで動画履歴を無限スクロール表示。各動画カードにSlackメッセージリンク、生成ステータス、再生プレーヤー。
- 手動生成ボタン、Slack再送ボタン、統計プレビュー(生成成功率、平均生成時間など)。

### `/settings`
- 共通ヘッダー(ユーザーアカウント、保存状態インジケーター)。各セクションはカード表示でスクリーンショットのUIを再現。
- App Routerでセクションごとにルートを分割し、`/settings/prompts`, `/settings/video-prompts`, `/settings/notifications`, `/settings/ranking-video-style` などの形で画面を切り分ける。共通レイアウト内でタブ/サイドバーのナビゲーションを実装し、URLで状態を保持する。
- **プロンプト設定**(OpenAI利用 / `/settings/prompts`):
  - アカウントID/表示名などランキング生成に必要な文脈フィールド。
  - キャラクター設定、ルール、ランキング形式、テスト実行ボタン(OpenAI呼び出し)。
  - テスト実行はOpenAIから得たランキング案のプレビューをモーダル表示し、APIレスポンスのJSONもダウンロード可能にする。
- **動画プロンプト設定**(kie.ai利用 / `/settings/video-prompts`):
  - 背景生成やシーン設定、BGMタイプ、テキスト位置などのフィールド。
  - テンプレート保存・複製・バージョン履歴。バージョンの差分比較と復元を提供し、ランキング単位で適用するテンプレートを選択できる。
- **通知設定**(Slack利用 / `/settings/notifications`):
  - Slack Bot Token、デフォルトチャンネルID、投稿テンプレート(本文、絵文字、メンション設定)。
  - テスト送信ボタン(成功/失敗トースト)。Slack APIレスポンスコードを表示し、エラー時の対処法リンクを添付。
- **ランキング動画 編集設定**(kie.ai利用 / `/settings/ranking-video-style`):
  - タイトル文字色、本文色、枠線色、CTAテキスト、訴求動画挿入ON/OFF。
  - 訴求動画のアップロード(5秒まで)とプレビュー。kie.aiに送信される構造化ペイロードを確認できるプレビューパネルを提供。
- React Hook Form + Zodでバリデーション。保存時はOptimistic UIとトースト通知を行い、サブページ間遷移後も保存状態を維持する。

## バックエンド仕様
- Route Handlersディレクトリを機能別に分割(`app/api/settings`, `app/api/rankings`, `app/api/videos`など)。
- Prismaを用いたDBアクセス(採用する場合)。設定値は暗号化フィールドで保存(AES-GCM + KMS Secret)。
- Slack通知は専用サービスクラスでラップし、レート制御とエラーハンドリングを実装。
- ジョブキューはUpstash Redis Stream/BullMQ互換ライブラリを想定。Serverless Workerで処理。
- Webhook署名検証、APIレートリミット(Upstash Rate Limiting)を導入。
- ロギング: Vercel Observability + OpenTelemetry。Slack投稿結果を構造化ログに記録。
- テスト: Vitestでサービス層のユニットテスト、PlaywrightでフロントE2E。Slack/OpenAI/kie.aiはモック化。

## デプロイ/運用
- **デプロイ先**: Vercel (Next.jsアプリ、Route Handlers、Cron Jobs)。
- **CI/CD**: GitHub ActionsでLint(ESLint)、Test(Vitest/Playwright)、Buildチェック。mainブランチへのマージでVercel自動デプロイ。
- **環境変数**: VercelのProject Settingsで管理。Preview/ProductionごとにSlackチャンネル等を分離。
- **モニタリング**: Vercel Analytics、Slack投稿のサマリーメトリクス、ジョブ失敗アラート。
- **運用手順**:
  1. APIキー/Slack Bot Tokenのローテーション手順を定義。
  2. ジョブ失敗時は再試行→手動再送→サポート連絡のSOPを整備。
  3. Slackチャンネル構成(運用/検証)とアクセス権限を管理。

## ローカル開発ガイド (スキャフォールド)

このリポジトリには、Next.js(App Router)ベースのフロントエンドと、Expressによる簡易バックエンドのガワ実装が含まれています。

### 必要環境
- Node.js 18 以上
- npm

### 初期セットアップ
```bash
npm install
```

### フロントエンドの起動
```bash
npm run dev
```
`http://localhost:3000` でランキング画面および `/settings/*` サブルートを確認できます。各フォームはReact Hook Form + Zodでバリデーション済みのモック保存処理を備えています。

### バックエンドモックの起動
```bash
npm run backend
```
`http://localhost:4000` で稼働し、OpenAI/kie.ai/Slack連携を模した簡易エンドポイント(`/jobs/openai`, `/jobs/kie-ai`, `/notifications/slack`)を提供します。環境変数として `OPEN_AI_YOUR_API_KEY`, `KIE_AI_API_KEY`, `SLACK_BOT_TOKEN` を設定してください。

### 環境変数の例
`.env.local` や `.env` に以下を設定するとモックが動作します。

```
OPEN_AI_YOUR_API_KEY=sk-openai-placeholder
KIE_AI_API_KEY=kie-ai-placeholder
SLACK_BOT_TOKEN=xoxb-placeholder
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-placeholder
```

> **NOTE:** 現状はあくまでモック実装です。Supabaseや外部APIへの実接続ロジックは `app/api/*` や `backend/server.js` の`console.info`部分を差し替えて拡張してください。

## リスクと対策
- **APIコスト**: レート制御、ランキング単位の生成頻度設定、月次上限。
- **生成失敗**: 再試行ポリシー、Slack失敗通知、ジョブステータス画面。
- **ストレージ圧迫**: ライフサイクルルールで古い動画を自動アーカイブ。Slack投稿済み動画の保持期間を設定。
- **セキュリティ**: APIキー・Slackトークンを暗号化保存、Webhook署名検証、RBAC、HTTPS強制。
- **パフォーマンス**: 動画リストキャッシュ、Slack投稿の非同期化、OpenAIレスポンスの再利用。

## 将来的な拡張
- Instagram API連携による自動投稿やメトリクス同期。
- 複数Slackワークスペース/チャンネルの切り替えと権限管理。
- プロンプトABテスト、自動レコメンド、生成コスト分析ダッシュボード。
- モバイルアプリ(React Native/Expo)やデスクトップ通知の追加。
- Slack以外の通知(メール、LINE、Discord)への拡張。
