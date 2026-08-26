import Link from "next/link";
import { Layout, Bio, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";
import { getSiteMetaData } from "@utils/helpers";
import { presentations } from "content/presentations";

const siteMetadata = getSiteMetaData();
export default function Home({ posts }) {
  return (
    <Layout>
      <Bio className="mb-16" />
      <SEO title={siteMetadata.title} description={siteMetadata.description}/>
      <section
        className="pt-8 mb-16 border-t retro-rule"
        aria-labelledby="featured-presentations"
      >
        <div className="flex flex-col mb-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-black" id="featured-presentations">
              <Link legacyBehavior href="/presentations">
                <a className="section-heading">Featured presentations</a>
              </Link>
            </h2>
            <p className="text-base" style={{color: 'var(--muted)'}}>
              Recent talks, demos, and experiments in open infrastructure.
            </p>
          </div>
          <Link legacyBehavior href="/presentations">
            <a className="mt-3 font-semibold sm:mt-0">View all →</a>
          </Link>
        </div>
        {presentations.slice(0, 3).map((presentation) => (
          <article
            className="pt-6 mt-6"
            key={presentation.url}
          >
            <p className="mb-2 eyebrow">
              {presentation.affiliation}
            </p>
            <h3 className="mb-2 text-2xl font-bold font-display">
                <a
                className="post-link"
                href={presentation.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${presentation.title} (opens in a new tab)`}
              >
                {presentation.title}
              </a>
            </h3>
            <p className="mb-3 text-base leading-relaxed">
              {presentation.description}
            </p>
            <a
              className="font-semibold"
              href={presentation.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open presentation
              <span className="sr-only"> (opens in a new tab)</span>{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </section>
      <section className="pt-8 border-t retro-rule" aria-labelledby="writing">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-black" id="writing">
            <Link legacyBehavior href="/writing">
              <a className="section-heading">Notes & writing</a>
            </Link>
          </h2>
          <Link legacyBehavior href="/writing">
            <a className="font-semibold">View all →</a>
          </Link>
        </div>
      {posts.slice(0, 4).map(({ frontmatter: { title, description, date }, slug }) => (
        <article key={slug}>
          <header className="mb-2">
            <h3 className="mb-2">
              <Link legacyBehavior href={"/post/[slug]"} as={`/post/${slug}`}>
                <a className="text-3xl font-bold post-link">
                  {title}
                </a>
              </Link>
            </h3>
            <span className="text-sm">{date}</span>
          </header>
          <section>
            <p className="mb-8 text-lg">{description}</p>
          </section>
        </article>
      ))}
        {posts.length > 4 && (
          <Link legacyBehavior href="/writing">
            <a className="inline-block mt-2 font-semibold">Browse the archive →</a>
          </Link>
        )}
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getSortedPosts().slice(0, 4);
  return {
    props: {
      posts,
    },
  };
}
