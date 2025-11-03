interface RankingDetailPageProps {
  params: { id: string };
}

const mockVideos = [
  {
    id: "video-1",
    title: "最新AIツールTop5",
    createdAt: "2024-04-18 09:30",
    slackPermalink: "https://slack.com/app_redirect?channel=C0123456789&message=1700000000.000000"
  },
  {
    id: "video-2",
    title: "バイラル音源ランキング",
    createdAt: "2024-04-18 08:00",
    slackPermalink: "https://slack.com/app_redirect?channel=C0123456789&message=1699990000.000000"
  }
];

export default function RankingDetailPage({ params }: RankingDetailPageProps) {
  return (
    <section className="grid" style={{ gap: "1.5rem" }}>
      <header>
        <h1 className="section-title">{params.id} の動画履歴</h1>
        <p className="subtitle">Slack投稿リンクと生成日時を確認できます。</p>
      </header>
      <div className="grid-2">
        {mockVideos.map((video) => (
          <article key={video.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className="video-frame">プレビュー</div>
            <div>
              <strong>{video.title}</strong>
              <p className="subtitle">生成日時: {video.createdAt}</p>
            </div>
            <a className="button-secondary" href={video.slackPermalink} target="_blank" rel="noreferrer">
              Slackで開く
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
