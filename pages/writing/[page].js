import Link from "next/link";
import { Layout, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";

const PAGE_SIZE = 6;

export default function WritingArchive({ posts, page, pageCount }) {
  return (
    <Layout>
      <SEO title={`Writing — page ${page}`} description="Notes on engineering, data, and technology." />
      <header className="mb-12">
        <p className="mb-3 eyebrow terminal-label">writing</p>
        <h1 className="mb-3 text-5xl font-black">Notes & writing</h1>
        <p className="max-w-xl text-lg" style={{ color: "var(--muted)" }}>
          A calmer place to browse the archive. Page {page} of {pageCount}.
        </p>
      </header>
      <section aria-label="Writing archive">
        {posts.map(({ frontmatter: { title, description, date }, slug }) => (
          <article className="pt-6 mb-8 border-t retro-rule" key={slug}>
            <p className="mb-2 text-sm" style={{ color: "var(--muted)" }}>{date}</p>
            <h2 className="mb-2 text-3xl font-bold">
              <Link legacyBehavior href="/post/[slug]" as={`/post/${slug}`}>
                <a>{title}</a>
              </Link>
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed">{description}</p>
          </article>
        ))}
      </section>
      <nav className="flex items-center justify-between pt-6 mt-10 border-t retro-rule" aria-label="Writing pages">
        {page > 1 ? <Link legacyBehavior href={`/writing/${page - 1}`}><a>← Newer</a></Link> : <span />}
        {page < pageCount ? <Link legacyBehavior href={`/writing/${page + 1}`}><a>Older →</a></Link> : <span />}
      </nav>
    </Layout>
  );
}

export async function getStaticPaths() {
  const pageCount = Math.ceil(getSortedPosts().length / PAGE_SIZE);
  return {
    paths: Array.from({ length: pageCount }, (_, index) => ({ params: { page: String(index + 1) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { page } }) {
  const allPosts = getSortedPosts();
  const pageNumber = Number(page);
  const pageCount = Math.ceil(allPosts.length / PAGE_SIZE);
  return {
    props: {
      posts: allPosts.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE),
      page: pageNumber,
      pageCount,
    },
  };
}
