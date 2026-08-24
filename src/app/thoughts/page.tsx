import Link from "next/link";
import { posts } from "@/data/thoughts";

export const metadata = { title: "Thoughts" };

export default function ThoughtsPage() {
  return (
    <>
      <p className="kicker">Thoughts</p>
      <h1>Notes on the work</h1>
      {posts.map((post) => (
        <Link key={post.slug} href={`/thoughts/${post.slug}`} className="post">
          <h2>{post.title}</h2>
          <p className="muted">{post.excerpt}</p>
          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </>
  );
}
