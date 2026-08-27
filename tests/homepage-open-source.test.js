const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "out");

function readOutput(...segments) {
  const filePath = path.join(outputRoot, ...segments);
  assert(
    fs.existsSync(filePath),
    `production export must contain ${segments.join("/")}`
  );
  return fs.readFileSync(filePath, "utf8");
}

function sectionById(html, id) {
  const headingIndex = html.indexOf(`id="${id}"`);
  assert(headingIndex >= 0, `production homepage must include #${id}`);
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  assert(
    sectionStart >= 0 && sectionEnd >= 0,
    `#${id} must belong to a semantic section`
  );
  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

const home = readOutput("index.html");
const openSource = sectionById(home, "open-source");

[
  [
    "Feast",
    "https://github.com/feast-dev/feast",
    "Maintainer",
    "The open-source feature store for production machine learning.",
  ],
  [
    "Kubeflow",
    "https://github.com/kubeflow/community",
    "Steering committee",
    "I serve on the Kubeflow Steering Committee",
  ],
  [
    "Llama Stack (now OGX)",
    "https://github.com/ogx-ai/ogx",
    "Maintainer",
    "An open-source, vendor-neutral application server for generative AI.",
  ],
  [
    "vLLM Agentic API",
    "https://github.com/vllm-project/agentic-api",
    "Maintainer · vLLM community",
    "The stateful agentic API layer for vLLM",
  ],
].forEach(([name, url, role, description]) => {
  const linkIndex = openSource.indexOf(`href="${url}"`);
  const articleStart = openSource.lastIndexOf("<article", linkIndex);
  const articleEnd = openSource.indexOf("</article>", linkIndex);
  const article = openSource.slice(articleStart, articleEnd);

  assert(
    linkIndex >= 0 && article.includes(name),
    `the Open Source section must link ${name} to its official project`
  );
  assert(
    article.includes(role) && article.includes(description),
    `the ${name} entry must describe the requested open-source role`
  );
});

assert(
  openSource.includes("Llama Stack (now OGX)"),
  "the project name must communicate the Llama Stack rename"
);
assert(
  openSource.includes("Kubeflow Steering Committee"),
  "the Open Source section must state the Kubeflow governance role"
);
assert(
  openSource.includes(
    "https://commit-history.com/embed/franciscojavierarceo?theme=dark&amp;metric=total"
  ),
  "the server-rendered commit history must use the site's dark default"
);
assert(
  openSource.includes('alt="franciscojavierarceo&#x27;s commit history"'),
  "the commit-history graphic must have descriptive alternative text"
);
assert(
  openSource.includes('width="800"') && openSource.includes('height="400"'),
  "the commit-history graphic must reserve its intrinsic layout space"
);

console.log("homepage open-source section: ok");
