import { useTheme } from "next-themes";

const { getCommitHistoryImageUrl } = require("@utils/commit-history");

export function CommitHistory() {
  const { resolvedTheme } = useTheme();
  const imageUrl = getCommitHistoryImageUrl(resolvedTheme);

  return (
    <a
      className="block"
      href="https://commit-history.com/franciscojavierarceo?metric=total"
      aria-label="View Francisco Javier Arceo's full commit history"
    >
      <img
        className="block w-full h-auto mx-auto commit-history"
        alt="franciscojavierarceo's commit history"
        src={imageUrl}
        width="800"
        height="400"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
