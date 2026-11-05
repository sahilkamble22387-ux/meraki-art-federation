import { TV_ARTICLES } from "@/lib/thevertmenthe-articles";
import { TvArticlePage } from "@/components/thevertmenthe/tv-article-page";

export function generateStaticParams() {
  return TV_ARTICLES.map((a) => ({ slug: a.uid }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = TV_ARTICLES.find((a) => a.uid === slug);
  return {
    title: article
      ? `${article.title} — Meraki Art Federation`
      : "Meraki Art Federation",
    description: article
      ? `View "${article.title}" by Meraki Art Federation. ${article.size || ""} ${article.technique || ""}`
      : "Artwork details from the Meraki Art Federation vault.",
  };
}

export const dynamicParams = false;

export default async function GalleryArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = TV_ARTICLES.findIndex((a) => a.uid === slug);
  const article = TV_ARTICLES[idx];
  if (!article) return null;
  const prev = idx > 0 ? TV_ARTICLES[idx - 1] : null;
  const next = idx < TV_ARTICLES.length - 1 ? TV_ARTICLES[idx + 1] : null;
  return <TvArticlePage article={article} prev={prev} next={next} />;
}
