const COMMIT_HISTORY_EMBED =
  "https://commit-history.com/embed/franciscojavierarceo";

function getCommitHistoryImageUrl(theme) {
  return theme === "light"
    ? `${COMMIT_HISTORY_EMBED}?metric=total`
    : `${COMMIT_HISTORY_EMBED}?theme=dark&metric=total`;
}

module.exports = { getCommitHistoryImageUrl };
