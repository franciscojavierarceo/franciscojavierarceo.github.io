const assert = require("assert");
const { vectorPoint } = require("../utils/vector");

const point = vectorPoint([9, 9]);

assert(point.x >= 8 && point.x <= 92, "x endpoint must stay inside the graph");
assert(point.y >= 8 && point.y <= 92, "y endpoint must stay inside the graph");

console.log("Bio vector bounds test passed.");
