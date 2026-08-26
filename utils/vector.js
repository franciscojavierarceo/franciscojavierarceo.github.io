const GRAPH_MIN = 8;
const GRAPH_MAX = 92;
const VECTOR_SCALE = 4.5;

const clamp = (value) => Math.max(GRAPH_MIN, Math.min(GRAPH_MAX, value));

function vectorPoint(vector) {
  return {
    x: clamp(50 + vector[0] * VECTOR_SCALE),
    y: clamp(50 - vector[1] * VECTOR_SCALE),
  };
}

module.exports = { vectorPoint };
