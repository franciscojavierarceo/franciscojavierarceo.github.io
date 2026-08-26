const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "out");
const presentationRoot = path.join(
  outputRoot,
  "presentations",
  "llm-d-agentic-api-demo"
);
const communityPresentationRoot = path.join(
  outputRoot,
  "presentations",
  "vllm-agentic-api-community-demo"
);
const requestedTags = [
  "vLLM",
  "llm-d",
  "Agentic API",
  "Kubernetes",
  "Codex",
  "Claude Code",
];
const communityTags = [
  "vLLM",
  "Agentic API",
  "Codex",
  "Claude Code",
  "llm-d",
  "Kubernetes",
];
const agenticApiLink =
  '<a href="https://github.com/vllm-project/agentic-api" target="_blank" rel="noopener noreferrer">Agentic API</a>';

function readOutput(...segments) {
  const filePath = path.join(outputRoot, ...segments);
  assert(
    fs.existsSync(filePath),
    `production export must contain ${segments.join("/")}`
  );
  return fs.readFileSync(filePath, "utf8");
}

function assertBinary(prefix, filePath, label) {
  const content = fs.readFileSync(filePath);
  assert(
    content.subarray(0, prefix.length).equals(prefix),
    `${label} must be copied intact into the production export`
  );
}

function listingArticle(listing, url) {
  const linkIndex = listing.indexOf(`href="${url}"`);
  assert(linkIndex >= 0, `the production listing must link to ${url}`);
  const articleStart = listing.lastIndexOf("<article", linkIndex);
  const articleEnd = listing.indexOf("</article>", linkIndex);
  assert(
    articleStart >= 0 && articleEnd >= 0,
    `the production listing must render ${url} inside an article`
  );
  return listing.slice(articleStart, articleEnd + "</article>".length);
}

function renderedTags(article) {
  const tagList = article.match(
    /<ul[^>]*aria-label="Presentation tags"[^>]*>([\s\S]*?)<\/ul>/
  );
  assert(tagList, "each production listing must expose an accessible tag list");
  return Array.from(
    tagList[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g),
    (match) => match[1].replace(/<[^>]+>/g, "").trim()
  );
}

function sectionById(html, id) {
  const headingIndex = html.indexOf(`id="${id}"`);
  assert(headingIndex >= 0, `production page must include #${id}`);
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  assert(
    sectionStart >= 0 && sectionEnd >= 0,
    `#${id} must belong to a semantic section`
  );
  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

function run() {
  const home = readOutput("index.html");
  const listing = readOutput("presentations.html");
  const presentation = readOutput(
    "presentations",
    "llm-d-agentic-api-demo",
    "index.html"
  );
  const communityPresentation = readOutput(
    "presentations",
    "vllm-agentic-api-community-demo",
    "index.html"
  );
  const communitySlides = readOutput(
    "presentations",
    "vllm-agentic-api-community-demo",
    "slides.js"
  );
  const communityStyles = readOutput(
    "presentations",
    "vllm-agentic-api-community-demo",
    "slides.css"
  );

  assert(
    home.includes('href="/presentations"'),
    "the production homepage must link to the presentations page"
  );
  const primaryNavigation = home.match(
    /<nav[^>]*aria-label="Primary navigation"[^>]*>([\s\S]*?)<\/nav>/
  );
  assert(primaryNavigation, "the production homepage must expose primary navigation");
  assert(
    primaryNavigation[1].includes('href="/about-me"') &&
      primaryNavigation[1].includes('href="/presentations"'),
    "primary navigation must link to About and Presentations"
  );
  const featuredPresentations = sectionById(home, "featured-presentations");
  assert(
    featuredPresentations.includes(
      "Open Agents. Distributed Inference. One Stack."
    ) &&
      featuredPresentations.includes(
        "Running Codex and Claude Code CLIs with vLLM and Open Models"
      ) &&
      featuredPresentations.includes(
        'href="/presentations/llm-d-agentic-api-demo/"'
      ) &&
      featuredPresentations.includes(
        'href="/presentations/vllm-agentic-api-community-demo/"'
    ),
    "the homepage must feature both standalone presentation links"
  );
  [
    "/presentations/llm-d-agentic-api-demo/",
    "/presentations/vllm-agentic-api-community-demo/",
  ].forEach((url) => {
    const featuredArticle = listingArticle(featuredPresentations, url);
    assert(
      featuredArticle.includes('target="_blank"') &&
        featuredArticle.includes('rel="noopener noreferrer"') &&
        featuredArticle.includes("opens in a new tab"),
      `featured presentation ${url} must announce and safely open a new tab`
    );
  });
  assert(
    home.includes('id="writing"') && home.includes(">Notes &amp; writing</a>"),
    "the homepage must distinguish the writing section"
  );
  assert(
    listing.includes("Open Agents. Distributed Inference. One Stack."),
    "the production listing must include the presentation title"
  );
  assert(
    listing.includes("Francisco Javier Arceo") && listing.includes("Red Hat AI"),
    "the production listing must include presenter and affiliation"
  );
  assert(
    listing.includes("A community demo of vLLM ") &&
      listing.includes(
        "vLLM, agent harnesses, server-side web search, and the path toward llm-d integration and disaggregated Responses."
      ) &&
      listing.includes(agenticApiLink),
    "the production listing must include the requested description with a repository link"
  );
  const firstArticle = listingArticle(
    listing,
    "/presentations/llm-d-agentic-api-demo/"
  );
  assert.deepStrictEqual(
    renderedTags(firstArticle),
    requestedTags,
    "the production listing must include exactly the requested tags"
  );
  assert(
    firstArticle.includes('target="_blank"') &&
      firstArticle.includes('rel="noopener noreferrer"'),
    "the listing must open the standalone presentation safely in a new tab"
  );

  assert(
    presentation.includes('src="cais-responses-api-diagram.png"'),
    "the presentation must retain its relative CAIS diagram reference"
  );
  assert(
    presentation.includes('src="codex-agentic-api-demo.mp4"'),
    "the presentation must retain its relative video reference"
  );
  assert(
    presentation.includes('document.addEventListener("keydown"') &&
      presentation.includes('class="speaker-notes"') &&
      presentation.includes('src="../agentic-api-links.js"') &&
      presentation.includes('linkifyAgenticApi'),
    "the standalone presentation must retain keyboard controls and presenter notes"
  );

  const communityArticle = listingArticle(
    listing,
    "/presentations/vllm-agentic-api-community-demo/"
  );
  assert(
    communityArticle.includes(
      "Running Codex and Claude Code CLIs with vLLM and Open Models"
    ) &&
      communityArticle.includes("Francisco Javier Arceo") &&
      communityArticle.includes("Tun Jian Tan") &&
      communityArticle.includes("Red Hat AI") &&
      communityArticle.includes("Embedded LLM"),
    "the second listing must include its title, presenters, and affiliations"
  );
  assert(
    communityArticle.includes("A community presentation and recorded demo of the vLLM ") &&
      communityArticle.includes(
        "runtime, open-model inference, tool orchestration, and the path toward llm-d integration."
      ) &&
      communityArticle.includes(agenticApiLink),
    "the second listing must include its requested description with a repository link"
  );
  assert.deepStrictEqual(
    renderedTags(communityArticle),
    communityTags,
    "the second listing must include exactly its requested tags"
  );
  assert(
    communityArticle.includes('target="_blank"') &&
      communityArticle.includes('rel="noopener noreferrer"'),
    "the second listing must open safely in a new tab"
  );
  assert(
      communityPresentation.includes('href="slides.css"') &&
      communityPresentation.includes('src="slides.js"') &&
      communityPresentation.includes('src="../agentic-api-links.js"') &&
      communityPresentation.includes(
        'src="agentic-api-claude-gpt56-demo-tight.mp4"'
      ) &&
      !communityPresentation.includes(
        '../../agentic-api-claude-gpt56-demo-tight.mp4'
    ),
    "the second standalone deck must use self-contained relative assets"
  );
  assert(
    communityStyles.includes(".slide") &&
      communityStyles.includes(".notes-panel") &&
      communityStyles.includes(".demo-video"),
    "the second production export must include its slide, notes, and video styles"
  );
  assert.strictEqual(
    (communityPresentation.match(/data-notes=/g) || []).length,
    6,
    "the second standalone deck must retain notes for all six slides"
  );
  assert.strictEqual(
    (communityPresentation.match(/<section\b[^>]*\bclass="slide\b/g) || [])
      .length,
    6,
    "the second standalone deck must retain all six slide sections"
  );
  assert(
    communitySlides.includes('document.addEventListener("keydown"') &&
      communitySlides.includes('event.key.toLowerCase() === "f"') &&
      communitySlides.includes('event.key.toLowerCase() === "n"') &&
      communitySlides.includes('action === "fullscreen"') &&
      communitySlides.includes('action === "notes"') &&
      communitySlides.includes('linkifyAgenticApi'),
    "the second standalone deck must retain keyboard, fullscreen, and notes controls"
  );

  assertBinary(
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    path.join(presentationRoot, "cais-responses-api-diagram.png"),
    "CAIS diagram"
  );
  const video = fs.readFileSync(
    path.join(presentationRoot, "codex-agentic-api-demo.mp4")
  );
  assert.strictEqual(
    video.subarray(4, 8).toString("ascii"),
    "ftyp",
    "MP4 must be copied intact into the production export"
  );
  assertBinary(
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    path.join(communityPresentationRoot, "assets", "llmd-kubernetes-fleet.png"),
    "llm-d Kubernetes fleet diagram"
  );
  assertBinary(
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    path.join(
      communityPresentationRoot,
      "assets",
      "francisco-javier-arceo.png"
    ),
    "Francisco Javier Arceo presenter portrait"
  );
  assertBinary(
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    path.join(communityPresentationRoot, "assets", "tun-jian-tan.png"),
    "Tun Jian Tan presenter portrait"
  );
  const communityVideo = fs.readFileSync(
    path.join(
      communityPresentationRoot,
      "agentic-api-claude-gpt56-demo-tight.mp4"
    )
  );
  assert.strictEqual(
    communityVideo.subarray(4, 8).toString("ascii"),
    "ftyp",
    "community demo MP4 must be copied intact into the production export"
  );

  console.log("Presentation publishing integration test passed.");
}

run();
