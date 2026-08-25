const AGENTIC_API_REPOSITORY = "https://github.com/vllm-project/agentic-api";

export function AgenticApiLink({ children }) {
  const text = String(children);
  const parts = text.split(/(Agentic API)/gi);

  return parts.map((part, index) =>
    /^Agentic API$/i.test(part) ? (
      <a
        href={AGENTIC_API_REPOSITORY}
        key={`${part}-${index}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
