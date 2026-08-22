import { notFound } from "next/navigation";
import { posts } from "@/data/thoughts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Note" };
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <p className="kicker">{post.date}</p>
      <h1>{post.title}</h1>
      <p className="lede">{post.excerpt}</p>
      <p>
        Body copy goes here. Keep these short: one idea, one example from a
        project, one takeaway a hiring manager can remember.
      </p>
    </>
  );
}
