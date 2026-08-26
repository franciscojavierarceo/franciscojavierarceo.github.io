import Link from "next/link";
import { Layout, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";

export default function WritingIndex({ posts }) {
  return (
    <Layout>
      <SEO title="Writing" description="The complete archive of Francisco Javier Arceo's writing." />
      <header className="mb-12">
        <p className="mb-3 eyebrow terminal-label">archive</p>
        <h1 className="mb-3 text-5xl font-black">All writing</h1>
        <p className="max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          Notes on engineering, data, open source, and whatever else catches my attention.
        </p>
      </header>
      <section aria-label="Complete writing archive">
        {posts.map(({ frontmatter: { title, description, date }, slug }, index) => (
          <article className="flex flex-col gap-2 py-5 border-t retro-rule sm:flex-row sm:items-baseline sm:gap-8" key={slug}>
            <span className="w-8 text-sm eyebrow" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className="flex-1">
              <h2 className="mb-1 text-2xl font-bold">
                <Link legacyBehavior href="/post/[slug]" as={`/post/${slug}`}>
                  <a className="post-link">{title}</a>
                </Link>
              </h2>
              <p className="text-base" style={{ color: "var(--muted)" }}>{description}</p>
            </div>
            <time className="text-sm whitespace-nowrap" style={{ color: "var(--muted)" }}>{date}</time>
          </article>
        ))}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: { posts: getSortedPosts() } };
}
