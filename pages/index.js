import Link from "next/link";
import { AgenticApiLink, CommitHistory, Layout, Bio, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";
import { getSiteMetaData } from "@utils/helpers";
import { presentations } from "content/presentations";
import { publications } from "content/publications";

const siteMetadata = getSiteMetaData();
const openSourceProjects = [
  {
    role: "Maintainer",
    name: "Feast",
    url: "https://github.com/feast-dev/feast",
    description:
      "The open-source feature store for production machine learning.",
  },
  {
    role: "Steering committee",
    name: "Kubeflow",
    url: "https://github.com/kubeflow/community",
    description:
      "I serve on the Kubeflow Steering Committee, helping guide the project's governance and direction.",
  },
  {
    role: "Maintainer",
    name: "Llama Stack (now OGX)",
    url: "https://github.com/ogx-ai/ogx",
    description:
      "An open-source, vendor-neutral application server for generative AI.",
  },
  {
    role: "Maintainer · vLLM community",
    name: "vLLM Agentic API",
    url: "https://github.com/vllm-project/agentic-api",
    description:
      "The stateful agentic API layer for vLLM, built in Rust for open-model workloads.",
  },
];

export default function Home({ posts }) {
  return (
    <Layout>
      <Bio className="mb-16" />
      <SEO title={siteMetadata.title} description={siteMetadata.description}/>
      <section
        className="pt-8 mb-16 border-t retro-rule"
        aria-labelledby="open-source"
      >
        <div className="max-w-2xl">
          <h2 className="mb-2 text-3xl font-black" id="open-source">
            Open source
          </h2>
          <p className="text-base" style={{color: 'var(--muted)'}}>
            I maintain and help govern open infrastructure for production AI
            and machine learning.
          </p>
        </div>
        <div className="grid gap-6 mt-8 sm:grid-cols-2">
          {openSourceProjects.map((project) => (
            <article className="pt-5 border-t retro-rule" key={project.url}>
              <p className="mb-2 eyebrow">{project.role}</p>
              <h3 className="mb-2 text-2xl font-bold font-display">
                <a
                  className="post-link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} (opens in a new tab)`}
                >
                  {project.name}
                </a>
              </h3>
              <p className="text-base leading-relaxed">{project.description}</p>
            </article>
          ))}
        </div>
        <div className="pt-8 mt-8 border-t retro-rule">
          <CommitHistory />
        </div>
      </section>
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
      <section
        className="pt-8 mb-16 border-t retro-rule"
        aria-labelledby="publications"
      >
        <div className="flex flex-col mb-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-black" id="publications">
              Publications & papers
            </h2>
            <p className="text-base" style={{color: 'var(--muted)'}}>
              Research and inventions at the intersection of AI systems, security, and machine learning.
            </p>
          </div>
        </div>
        {publications.map((publication) => (
          <article className="pt-6 mt-6" key={publication.url}>
            <p className="mb-2 eyebrow">{publication.type}</p>
            <h3 className="mb-2 text-2xl font-bold font-display">
              <a
                className="post-link"
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${publication.title} (opens in a new tab)`}
              >
                {publication.title}
              </a>
            </h3>
            {publication.authors && (
              <p className="mb-3 text-base" style={{color: 'var(--muted)'}}>
                {publication.authors}
              </p>
            )}
            <a
              className="font-semibold"
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publication.linkLabel} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
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
