const assert = require("assert");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(projectRoot, "out");

function readOutput(...segments) {
  return fs.readFileSync(path.join(outputRoot, ...segments), "utf8");
}

const home = readOutput("index.html");
const about = readOutput("about-me.html");
const cssRoot = path.join(outputRoot, "_next", "static", "css");
const css = fs
  .readdirSync(cssRoot)
  .filter((fileName) => fileName.endsWith(".css"))
  .map((fileName) => readOutput("_next", "static", "css", fileName))
  .join("\n");

[home, about].forEach((page) => {
  assert(
    /<img[^>]+src="\/profile\.jpg"[^>]+class="[^"]*profile-photo[^"]*"/.test(
      page
    ),
    "each rendered profile image must use the shared circular-photo style"
  );
});
assert(
  css.includes(".profile-photo") &&
    css.includes("border-radius:9999px") &&
    css.includes("aspect-ratio:1/1") &&
    css.includes("object-fit:cover"),
  "the production stylesheet must enforce a circular, cover-cropped profile photo"
);

console.log("profile photo styling: ok");
