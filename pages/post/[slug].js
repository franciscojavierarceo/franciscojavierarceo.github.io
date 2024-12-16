import React from 'react';
import Link from "next/link";
import ReactMarkdown from "react-markdown/with-html";
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import { Layout, Footer, Image, SEO, Bio } from "@components/common";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";

function MarkdownRender(props) {
  const newProps = {
    ...props,
    plugins: [
      RemarkMathPlugin,
    ],
    options: {
      tex2jax: {
        inlineMath: [ ['$','$'], ['\\(','\\)'] ],
        displayMath: [ ['$$','$$'], ['\[','\]'] ]
      }
    },
    renderers: {
      ...props.renderers,
      math: (props) =>
        <MathJax.Node formula={props.value} />,
      inlineMath: (props) =>
        <MathJax.Node inline formula={props.value} />
    }
  };
  return (
    <MathJax.Provider input="tex">
      <ReactMarkdown {...newProps} />
    </MathJax.Provider>
  );
}

export default function Post({ post, frontmatter, nextPost, previousPost }) {
  return (
    <Layout>
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
        <MarkdownRender
          className="mb-4 prose lg:prose-lg dark:prose-dark"
          escapeHtml={false}
          source={post.content}
          renderers={{
            code: CodeBlock,
            image: MarkdownImage
          }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getPostsSlugs();

  // Log the paths for debugging
  console.log('Generated paths in getStaticPaths:', JSON.stringify(paths, null, 2));

  // Ensure paths are in the correct format for Next.js
  const formattedPaths = paths.map(path => {
    // Ensure the slug is a string and not undefined
    const slug = path.params?.slug || '';
    return {
      params: { slug }
    };
  });

  return {
    paths: formattedPaths,
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

  console.log('postData:', JSON.stringify(postData, null, 2));

  return {
    props: {
      ...postData
    }
  };
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
