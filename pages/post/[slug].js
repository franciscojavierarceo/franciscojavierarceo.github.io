import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import remarkMath from 'remark-math';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/cjs/styles/prism/dracula";
import { Layout, Footer, Image as CustomImage, SEO, Bio } from "@components/common";
import { getPostBySlug, getPostsSlugs } from "@utils/posts";

function MarkdownRender(props) {
  return (
    <MathJaxContext>
      <ReactMarkdown 
        {...props}
        remarkPlugins={[remarkMath]}
        components={{
          ...props.components,
          math: ({value}) => <MathJax inline={false}>{value}</MathJax>,
          inlineMath: ({value}) => <MathJax inline>{value}</MathJax>
        }}
      />
    </MathJaxContext>
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
          components={{
            code: CodeBlock,
            img: MarkdownImage
          }}
        >
          {post.content}
        </MarkdownRender>
      </article>
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
  <CustomImage
    alt={alt}
    src={`/assets/${src}`}
    width={800}
    height={400}
    className="w-full"
    priority
    unoptimized
  />
);
