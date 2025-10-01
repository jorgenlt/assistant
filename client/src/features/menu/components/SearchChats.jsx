import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";
import { updateCurrentId } from "../../chat/chatSlice";

const LOCAL_STORAGE_KEY = "chat_search_recent";
const MAX_RECENT = 6;

const escapeHtml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const highlight = (text = "", query = "") => {
  if (!query) return escapeHtml(text);

  // split query into tokens and make a single regex to highlight each token
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // escape

  if (tokens.length === 0) return escapeHtml(text);

  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  return escapeHtml(text).replace(
    regex,
    '<mark class="bg-yellow-300 rounded">$1</mark>'
  );
};

const SearchChats = ({ onClose }) => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.chat.conversations || []);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  // refs for scrolling to active item
  const itemRefs = useRef({});

  // Sort conversations by most recent message timestamp for sensible defaults
  const conversationsSorted = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aDate = a.messages?.length
        ? new Date(a.messages[a.messages.length - 1].createdAt).getTime()
        : 0;
      const bDate = b.messages?.length
        ? new Date(b.messages[b.messages.length - 1].createdAt).getTime()
        : 0;
      return bDate - aDate;
    });
  }, [conversations]);

  // Fuse.js setup
  const fuse = useMemo(() => {
    return new Fuse(conversationsSorted, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "messages.content", weight: 0.4 },
      ],
      includeMatches: true,
      includeScore: true,
      threshold: 0.45,
      minMatchCharLength: 1,
      useExtendedSearch: false,
    });
  }, [conversationsSorted]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const results = fuse.search(query, { limit: 100 });
    // map to easier format
    return results.map((r) => ({
      item: r.item,
      matches: r.matches,
      score: r.score,
    }));
  }, [fuse, query]);

  // Build grouped lists: titleMatches and messageMatches (avoid duplicates)
  const grouped = useMemo(() => {
    if (!query.trim()) return { titleMatches: [], messageMatches: [] };

    const titleMatches = [];
    const messageMatches = [];
    const seen = new Set();

    for (const res of searchResults) {
      const { item, matches } = res;
      const id = item._id || item.id;
      if (!id) continue;

      // find if any match's key is title
      const isTitle = matches?.some((m) => m.key === "title");
      const isMessage = matches?.some(
        (m) => m.key && m.key.startsWith("messages")
      );

      if (isTitle && !seen.has(id)) {
        titleMatches.push({ conversation: item, matches });
        seen.add(id);
      }

      if (isMessage && !seen.has(id)) {
        messageMatches.push({ conversation: item, matches });
        seen.add(id);
      }

      // if neither flagged (rare), push to messageMatches as fallback
      if (!isTitle && !isMessage && !seen.has(id)) {
        messageMatches.push({ conversation: item, matches });
        seen.add(id);
      }
    }

    return { titleMatches, messageMatches };
  }, [searchResults, query]);

  // Flattened list for keyboard navigation
  const flatResults = useMemo(() => {
    return [...grouped.titleMatches, ...grouped.messageMatches].map(
      (g) => g.conversation
    );
  }, [grouped]);

  // handle keyboard on whole component (attached to input)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const id = flatResults[activeIndex]?._id;
      if (id) handleSelect(id, true);
    } else if (e.key === "Escape") {
      if (onClose) onClose();
    }
  };

  useEffect(() => {
    // reset active index when results change
    setActiveIndex(0);
  }, [flatResults.length, query]);

  useEffect(() => {
    // scroll active into view
    const active = flatResults[activeIndex]?._id;
    if (!active) return;
    const el = itemRefs.current[active];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex, flatResults]);

  const saveRecentSearch = (text) => {
    if (!text || !text.trim()) return;
    const normalized = text.trim();
    const updated = [
      normalized,
      ...recentSearches.filter((s) => s !== normalized),
    ].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (id) => {
    dispatch(updateCurrentId(id));
    if (query) saveRecentSearch(query);
    if (onClose) onClose();
  };

  const handleClear = () => {
    setQuery("");
  };

  const handleClickRecent = (text) => {
    setQuery(text);
  };

  const renderSnippet = (conversation, matches = []) => {
    // find the best message match or fallback to last message
    const messageMatch = matches?.find(
      (m) => m.key && m.key.startsWith("messages")
    );
    let snippet = "";

    if (messageMatch && messageMatch.indices && messageMatch.value) {
      // try to extract a substring around the first match
      const val = messageMatch.value;
      const indices = messageMatch.indices[0] || [];
      const start = Math.max(0, indices[0] - 40);
      const end = Math.min(val.length, indices[1] + 40);
      snippet = val.slice(start, end);
    } else if (conversation.messages?.length) {
      snippet =
        conversation.messages[conversation.messages.length - 1].content || "";
    }

    // highlight query tokens inside snippet
    return { __html: highlight(snippet, query) };
  };

  // top-level lists to render
  const titleMatchesList = grouped.titleMatches;
  const messageMatchesList = grouped.messageMatches;

  return (
    <div className="w-full md:w-xl bg-[var(--bg)] rounded-lg shadow p-2">
      <div className="p-2 border-b border-gray-700 flex items-center gap-2">
        <input
          className="w-full pr-10 bg-transparent focus:outline-none px-3 py-2"
          placeholder="Search chats..."
          name="query"
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          aria-label="clear"
          onClick={handleClear}
          className="flex px-2 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)] mr-10"
        >
          Clear
        </button>
      </div>

      <div className="py-2">
        <div className="px-2 h-[46vh] overflow-y-auto overflow-x-hidden">
          {query.trim() === "" ? (
            <div>
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="select-none text-gray-400 px-2 mb-2">
                    Recent searches
                  </div>
                  <div className="flex flex-wrap gap-2 px-2">
                    {recentSearches.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleClickRecent(r)}
                        className="flex px-2 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="select-none text-gray-400 px-2 mb-2">
                Recent conversations
              </div>
              {conversationsSorted.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  No conversations yet
                </div>
              ) : (
                conversationsSorted.map((conversation, i) => {
                  const id = conversation._id || conversation.id || i;
                  const lastMessage = conversation.messages?.length
                    ? conversation.messages[conversation.messages.length - 1]
                    : null;

                  return (
                    <div
                      key={id}
                      ref={(el) => (itemRefs.current[id] = el)}
                      onClick={() => handleSelect(conversation._id)}
                      className={`p-2 rounded-xl cursor-pointer hover:bg-[var(--hover)] hover:text-[var(--text-hover)]`}
                    >
                      <div className="font-semibold truncate">
                        {conversation.title || "(No title)"}
                      </div>
                      {lastMessage && (
                        <div
                          className="text-xs text-gray-400 truncate"
                          title={lastMessage.content}
                        >
                          {lastMessage.content}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : flatResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              😕 No matches found — try different words
            </div>
          ) : (
            <div>
              {titleMatchesList.length > 0 && (
                <div className="mb-6">
                  <div className="text-gray-400 px-1 mb-1">Title matches</div>
                  {titleMatchesList.map((g, idx) => {
                    const conversation = g.conversation;
                    const id = conversation._id || conversation.id || idx;
                    const isActive = flatResults[activeIndex]?._id === id;

                    return (
                      <div
                        key={id}
                        ref={(el) => (itemRefs.current[id] = el)}
                        onClick={() => handleSelect(conversation._id)}
                        className={`cursor-pointer select-none p-2 rounded-xl mb-1 ${
                          isActive
                            ? "bg-[var(--hover)] text-[var(--text-hover)]"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: highlight(
                              conversation.title || "(No title)",
                              query
                            ),
                          }}
                        />
                        <div
                          className="text-xs text-gray-400 truncate mt-1"
                          dangerouslySetInnerHTML={renderSnippet(
                            conversation,
                            g.matches
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {messageMatchesList.length > 0 && (
                <div>
                  <div className="text-gray-400 px-1 mb-1">Message matches</div>
                  {messageMatchesList.map((g, idx) => {
                    const conversation = g.conversation;
                    const id =
                      conversation._id || conversation.id || `m-${idx}`;
                    const isActive = flatResults[activeIndex]?._id === id;

                    return (
                      <div
                        key={id}
                        ref={(el) => (itemRefs.current[id] = el)}
                        onClick={() => handleSelect(conversation._id)}
                        className={`cursor-pointer select-none p-2 rounded-xl mb-1 ${
                          isActive
                            ? "bg-[var(--hover)] text-[var(--text-hover)]"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <div className="font-semibold truncate">
                          {conversation.title || "(No title)"}
                        </div>
                        <div
                          className="text-xs text-gray-400 truncate mt-1"
                          dangerouslySetInnerHTML={renderSnippet(
                            conversation,
                            g.matches
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchChats;
