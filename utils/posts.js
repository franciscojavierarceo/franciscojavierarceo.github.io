import matter from "gray-matter";
import fs from "fs";
import path from "path";

export function getPostsFolders() {
  // Get all posts folders located in `content/posts`
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  console.log('Reading posts from:', postsDirectory);

  const postFolders = fs
    .readdirSync(postsDirectory)
    .filter(folderName => {
      const folderPath = path.join(postsDirectory, folderName);
      return fs.statSync(folderPath).isDirectory();
    })
    .map(folderName => {
      console.log('Found post folder:', folderName);
      // Each folder should contain a markdown file with the same name
      const mdFilePath = path.join(postsDirectory, folderName, `${folderName}.md`);
      console.log('Looking for file:', mdFilePath);

      if (fs.existsSync(mdFilePath)) {
        return {
          directory: folderName,
          filename: `${folderName}.md`,
        };
      }
      return null;
    })
    .filter(Boolean); // Remove null entries

  console.log('Post folders:', JSON.stringify(postFolders, null, 2));
  return postFolders;
}

// Get day in format: Month day, Year. e.g. April 19, 2020
function getFormattedDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

export function getSortedPosts() {
  const postFolders = getPostsFolders();
  const postsDirectory = path.join(process.cwd(), 'content/posts');

  const posts = postFolders
    .map(({ filename, directory }) => {
      // Get raw content from file
      const filePath = path.join(postsDirectory, directory, filename);
      console.log('Reading post content from:', filePath);

      try {
        const markdownWithMetadata = fs.readFileSync(filePath).toString();

        // Parse markdown, get frontmatter data, excerpt and content.
        const { data, excerpt, content } = matter(markdownWithMetadata);

        const frontmatter = {
          ...data,
          date: getFormattedDate(data.date),
        };

        // Remove .md file extension from post name
        const slug = filename.replace(".md", "");

        return {
          slug,
          frontmatter,
          excerpt,
          content,
        };
      } catch (error) {
        console.error(`Error reading post ${filename}:`, error);
        return null;
      }
    })
    .filter(Boolean) // Remove null entries
    .sort(
      (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

  return posts;
}

export function getPostsSlugs() {
  const postFolders = getPostsFolders();
  console.log('Getting slugs for posts...');

  const paths = postFolders.map(({ filename }) => {
    const slug = filename.replace(".md", "");
    console.log('Generated slug:', slug);
    return {
      params: {
        slug,
      },
    };
  });

  console.log('Generated paths:', JSON.stringify(paths, null, 2));
  return paths;
}

export function getPostBySlug(slug) {
  const posts = getSortedPosts();

  const postIndex = posts.findIndex(({ slug: postSlug }) => postSlug === slug);

  // Handle case where post is not found
  if (postIndex === -1) {
    return {
      frontmatter: {},
      post: { content: '', excerpt: '' },
      previousPost: null,
      nextPost: null
    };
  }

  const { frontmatter, content, excerpt } = posts[postIndex];
  const previousPost = posts[postIndex + 1] || null;
  const nextPost = posts[postIndex - 1] || null;

  return { frontmatter, post: { content, excerpt }, previousPost, nextPost };
}
