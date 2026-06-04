import { fetchDevToArticles } from "@/lib/fetchers/devto";
import DevToClient from "./DevToClient";

const DEVTO_TOPIC_TAGS = ["career", "productivity", "ai", "programming"];

export default async function DevToSection() {
  const articles = await fetchDevToArticles(DEVTO_TOPIC_TAGS);

  return <DevToClient articles={articles} topicTags={DEVTO_TOPIC_TAGS} />;
}
