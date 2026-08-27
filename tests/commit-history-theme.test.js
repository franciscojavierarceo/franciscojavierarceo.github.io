const assert = require("assert");

let getCommitHistoryImageUrl;
try {
  ({ getCommitHistoryImageUrl } = require("../utils/commit-history"));
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
}

assert.strictEqual(
  typeof getCommitHistoryImageUrl,
  "function",
  "commit history must expose a theme-aware image URL selector"
);
assert.strictEqual(
  getCommitHistoryImageUrl("light"),
  "https://commit-history.com/embed/franciscojavierarceo?metric=total"
);
assert.strictEqual(
  getCommitHistoryImageUrl("dark"),
  "https://commit-history.com/embed/franciscojavierarceo?theme=dark&metric=total"
);
assert.strictEqual(
  getCommitHistoryImageUrl(undefined),
  "https://commit-history.com/embed/franciscojavierarceo?theme=dark&metric=total",
  "server rendering must use the site's dark default"
);

console.log("commit history theme selection: ok");
