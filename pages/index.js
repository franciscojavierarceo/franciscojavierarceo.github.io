import Link from "next/link";
import { AgenticApiLink, Layout, Bio, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";
import { getSiteMetaData } from "@utils/helpers";
import { presentations } from "content/presentations";

const siteMetadata = getSiteMetaData();
export default function Home({ posts }) {
  return (
    <Layout>
      <Bio className="my-5" />
      <SEO title={siteMetadata.title} description={siteMetadata.description}/>
      <section
        className="py-8 mb-10 border-t border-b border-gray-300 dark:border-gray-700"
        aria-labelledby="featured-presentations"
      >
        <div className="flex flex-col mb-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="mb-2 text-3xl font-black font-display"
              id="featured-presentations"
            >
              Featured presentations
            </h2>
            <p className="text-lg font-light">
              Recent talks and demos on open agent infrastructure.
            </p>
          </div>
          <Link href="/presentations">
            <a className="mt-3 font-semibold sm:mt-0">View all →</a>
          </Link>
        </div>
        {presentations.map((presentation) => (
          <article
            className="pt-6 mt-6 border-t border-gray-300 dark:border-gray-700"
            key={presentation.url}
          >
            <p className="mb-2 text-sm font-semibold tracking-wide uppercase">
              {presentation.affiliation}
            </p>
            <h3 className="mb-2 text-2xl font-bold font-display">
              <a
                href={presentation.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${presentation.title} (opens in a new tab)`}
              >
                {presentation.title}
              </a>
            </h3>
            <p className="mb-3 text-base leading-relaxed">
              <AgenticApiLink>{presentation.description}</AgenticApiLink>
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
      <section aria-labelledby="writing">
        <h2 className="mb-8 text-3xl font-black font-display" id="writing">
          Writing
        </h2>
      {posts.map(({ frontmatter: { title, description, date }, slug }) => (
        <article key={slug}>
          <header className="mb-2">
            <h3 className="mb-2">
              <Link href={"/post/[slug]"} as={`/post/${slug}`}>
                <a className="text-4xl font-bold text-link-blue font-display">
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
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getSortedPosts();
  return {
    props: {
      posts,
    },
  };
}
