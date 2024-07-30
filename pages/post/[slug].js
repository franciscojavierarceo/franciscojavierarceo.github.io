import Link from "next/link";
import ReactMarkdown from "react-markdown/with-html";
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import { Layout, Footer, Image, SEO, Bio } from "@components/common";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";
import Head from 'next/head';

const md = new MarkdownIt().use(texmath);

function MarkdownRender(props) {
  return (
    <div dangerouslySetInnerHTML={{ __html: md.render(props.source) }} />
  );
}

export default function Post({ post, frontmatter, nextPost, previousPost }) {
  return (
    <Layout>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css" integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc" crossOrigin="anonymous" />
      </Head>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description || post.excerpt}
      />
      <article>
        <header className="mb-8">
          <h1 className="mb-2 text-6xl font-black leading-none font-display">
            {frontmatter.title}
          </h1>
          <p className="text-sm">{frontmatter.date}</p>
        </header>
        <div className="mb-4 prose lg:prose-lg dark:prose-dark">
          <MarkdownRender source={post.content} />
        </div>
      </article>
      <nav className="flex justify-between mt-8">
        {previousPost && (
          <Link href={`/post/${previousPost.slug}`}>
            <span className="text-lg font-bold">← {previousPost.frontmatter.title}</span>
          </Link>
        )}
        {nextPost && (
          <Link href={`/post/${nextPost.slug}`}>
            <span className="text-lg font-bold">{nextPost.frontmatter.title} →</span>
          </Link>
        )}
      </nav>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const postData = getPostBySlug(slug);

  if (!postData.previousPost) {
    postData.previousPost = null;
  }

  if (!postData.nextPost) {
    postData.nextPost = null;
  }

  return { props: postData };
}

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter
        style={style}
        language={language}
        showLineNumbers={true}
        useInlineStyles={true}
        >
      {value}
    </SyntaxHighlighter>
  );
};

const MarkdownImage = ({ alt, src }) => (
  <Image
    alt={alt}
    src={require(`../../content/assets/${src}`)}
    webpSrc={require(`../../content/assets/${src}?webp`)}
    previewSrc={require(`../../content/assets/${src}?lqip`)}
    className="w-full"
  />
);
