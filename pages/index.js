import React from 'react';
import Link from "next/link";
import { Layout, Bio, SEO } from "@components/common";
import { getSortedPosts } from "@utils/posts";
import { getSiteMetaData } from "@utils/helpers";

const siteMetadata = getSiteMetaData();
export default function Home({ posts }) {
  return (
    <Layout>
      <Bio className="my-5" />
      <SEO title={siteMetadata.title} description={siteMetadata.description}/>
      {posts.map(({ frontmatter: { title, description, date }, slug }) => (
        <article key={slug}>
          <header className="mb-2">
            <h3 className="mb-2">
              <Link href={"/post/[slug]"} as={`/post/${slug}`}>
                <a className="text-4xl font-bold text-yellow-600 font-display">
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
