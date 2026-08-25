import { Layout, SEO } from "@components/common";
import { getSiteMetaData } from "@utils/helpers";
import { presentations } from "content/presentations";

const siteMetadata = getSiteMetaData();

export default function Presentations() {
  return (
    <Layout>
      <SEO
        title={`Presentations | ${siteMetadata.title}`}
        description="Presentations and technical demos by Francisco Javier Arceo."
      />
      <header className="my-8">
        <h1 className="mb-3 text-4xl font-black font-display">
          Presentations
        </h1>
        <p className="text-lg font-light">
          Talks and demos on open source AI infrastructure, distributed
          inference, and agentic systems.
        </p>
      </header>

      {presentations.map((presentation) => (
        <article
          className="py-8 border-t border-gray-300 dark:border-gray-700"
          key={presentation.url}
        >
          <p className="mb-3 text-sm font-semibold tracking-wide uppercase">
            {presentation.affiliation}
          </p>
          <h2 className="mb-3 text-3xl font-bold font-display">
            <a
              href={presentation.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {presentation.title}
            </a>
          </h2>
          <p className="mb-4 text-base">
            Presented by{" "}
            {presentation.presenters.map((presenter, index) => (
              <span key={presenter.name}>
                {index > 0 && "; "}
                <strong>{presenter.name}</strong>, {presenter.affiliation}
              </span>
            ))}
          </p>
          <p className="mb-5 text-lg leading-relaxed">
            {presentation.description}
          </p>
          <ul className="flex flex-wrap mb-6" aria-label="Presentation tags">
            {presentation.tags.map((tag) => (
              <li
                className="px-3 py-1 mb-2 mr-2 text-sm border border-gray-300 rounded-full dark:border-gray-700"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>
          <a
            className="text-lg font-bold"
            href={presentation.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open presentation <span aria-hidden="true">↗</span>
          </a>
        </article>
      ))}
    </Layout>
  );
}
