import { highlight } from "./searchUtils";

const getId = (c, fallbackIndex) => c?._id || c?.id || String(fallbackIndex);

const ResultsList = ({
  titleMatches = [],
  messageMatches = [],
  activeIndex = 0,
  setActiveIndex,
  flatResults = [],
  itemRefs,
  onSelect,
  query,
}) => {
  const renderSnippet = (conversation, matches = []) => {
    const messageMatch = matches?.find(
      (m) => m.key && m.key.startsWith("messages")
    );
    let snippet = "";
    if (messageMatch && messageMatch.value) {
      const val = messageMatch.value;
      const indices = (messageMatch.indices && messageMatch.indices[0]) || [];
      const start = Math.max(0, (indices[0] || 0) - 40);
      const end = Math.min(
        val.length,
        (indices[1] || Math.min(val.length, 120)) + 40
      );
      snippet = val.slice(start, end);
    } else if (conversation.messages?.length) {
      snippet =
        conversation.messages[conversation.messages.length - 1].content || "";
    }
    return { __html: highlight(snippet, query) };
  };

  const renderItem = (conversation, matches, idx, prefix = "") => {
    const id = getId(
      conversation,
      idx + (prefix === "m-" ? titleMatches.length : 0)
    );
    const isActive = getId(flatResults[activeIndex], 0) === id;
    return (
      <div
        key={id}
        ref={(el) => (itemRefs.current[id] = el)}
        onClick={() => onSelect(conversation)}
        onMouseEnter={() => setActiveIndex(idx)}
        className={`cursor-pointer select-none p-2 rounded-xl mb-1 ${
          isActive
            ? "bg-[var(--hover)] text-[var(--text-hover)]"
            : "hover:bg-gray-700"
        }`}
      >
        <div
          className="font-semibold truncate"
          dangerouslySetInnerHTML={{
            __html: highlight(conversation.title || "(No title)", query),
          }}
        />
        <div
          className="text-xs text-gray-400 truncate mt-1"
          dangerouslySetInnerHTML={renderSnippet(conversation, matches)}
        />
      </div>
    );
  };

  return (
    <div>
      {titleMatches.length > 0 && (
        <div className="mb-6">
          <div className="text-gray-400 px-1 mb-1">Title matches</div>
          {titleMatches.map((g, idx) =>
            renderItem(g.conversation, g.matches, idx)
          )}
        </div>
      )}

      {messageMatches.length > 0 && (
        <div>
          <div className="text-gray-400 px-1 mb-1">Message matches</div>
          {messageMatches.map((g, idx) =>
            renderItem(
              g.conversation,
              g.matches,
              idx + titleMatches.length,
              "m-"
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsList;
