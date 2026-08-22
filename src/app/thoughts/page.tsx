import Link from "next/link";
import { posts } from "@/data/thoughts";

export const metadata = { title: "Thoughts" };

export default function ThoughtsPage() {
  return (
    <>
      <p className="kicker">Thoughts</p>
      <h1>Notes on the work</h1>
      <p className="lede">
        Short posts, not a full CMS yet. Add Markdown later if the blog grows.
      </p>
      {posts.map((post) => (
        <Link key={post.slug} href={`/thoughts/${post.slug}`} className="post">
          <p className="caption">{post.date}</p>
          <h2>{post.title}</h2>
          <p className="muted">{post.excerpt}</p>
        </Link>
      ))}
    </>
  );
}
