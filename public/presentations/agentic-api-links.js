(() => {
  const repository = "https://github.com/vllm-project/agentic-api";
  const phrase = /Agentic API/gi;

  function linkify(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      phrase.lastIndex = 0;
      if (!parent || parent.closest("a, script, style, title, textarea") || parent.closest("svg") || !phrase.test(node.nodeValue)) {
        phrase.lastIndex = 0;
        continue;
      }
      textNodes.push(node);
    }
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      phrase.lastIndex = 0;
      while ((match = phrase.exec(textNode.nodeValue))) {
        fragment.append(textNode.nodeValue.slice(lastIndex, match.index));
        const link = document.createElement("a");
        link.href = repository;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = match[0];
        fragment.append(link);
        lastIndex = match.index + match[0].length;
      }
      fragment.append(textNode.nodeValue.slice(lastIndex));
      textNode.replaceWith(fragment);
    });
  }

  window.linkifyAgenticApi = linkify;
  linkify();
})();
