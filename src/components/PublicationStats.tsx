import { PublicationStats as StatsType } from "@/utils/stats";

interface Props {
  stats: StatsType;
}

export default function PublicationStats({ stats }: Props) {
  return (
    <div
      style={{
        marginTop: "12px",
        marginBottom: "8px",
        fontSize: "0.875rem",
        color: "#666",
      }}
    >
      <h3 style={{ marginBottom: "6px" }}>Publication Stats</h3>
      <div style={{ paddingLeft: "8px" }}>
        <div>✅ Articles: {stats.totalArticles}</div>
        <div>📝 Words: {stats.totalWordCount.toLocaleString()}</div>
      </div>
    </div>
  );
}
