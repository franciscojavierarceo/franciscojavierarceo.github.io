const assert = require("assert");
const { publications } = require("../content/publications");

assert.strictEqual(publications.length, 3);
assert.deepStrictEqual(
  publications.map(({ title }) => title),
  [
    "OGX: An Open-Source, Vendor-Neutral Generative AI Application Server",
    "Securing the Agent: Vendor-Neutral, Multitenant Enterprise Retrieval and Tool Use",
    "Method and apparatus for facilitating provision of exposure management based on streaming data feeds via machine learning and low latency modeling",
  ]
);
assert.ok(publications.every(({ url }) => /^https:\/\//.test(url)));

console.log("publications: ok");
