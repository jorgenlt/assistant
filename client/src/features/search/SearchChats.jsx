import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice";
import useFuse from "./useFuse";
import SearchInput from "./SearchInput";
import ResultsList from "./ResultsList";
import RecentSearches from "./RecentSearches";

const LOCAL_STORAGE_KEY = "chat_search_recent";
const MAX_RECENT = 6;

const getId = (c) => c?._id || c?.id || null;

const SearchChats = ({ onClose }) => {
  const dispatch = useDispatch();
  const conversations = useSelector((s) => s.chat.conversations || []);

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

  // sort conversations by most recent updatedAt (fallback to createdAt or 0)
  const conversationsSorted = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aDate = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const bDate = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, [conversations]);

  const { results: searchResults } = useFuse(conversationsSorted, query);

  // grouped results (titleMatches / messageMatches)
  const grouped = useMemo(() => {
    if (!query.trim()) return { titleMatches: [], messageMatches: [] };
    const titleMatches = [];
    const messageMatches = [];
    const seen = new Set();

    for (const r of searchResults) {
      const item = r.item || r;
      const matches = r.matches || [];
      const id = getId(item);
      if (!id) continue;

      const isTitle = matches.some((m) => m.key === "title");
      const isMessage = matches.some(
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
      if (!isTitle && !isMessage && !seen.has(id)) {
        messageMatches.push({ conversation: item, matches });
        seen.add(id);
      }
    }

    return { titleMatches, messageMatches };
  }, [searchResults, query]);

  const flatResults = useMemo(() => {
    return [...grouped.titleMatches, ...grouped.messageMatches].map(
      (g) => g.conversation
    );
  }, [grouped]);

  // refs for scrolling
  const itemRefs = useRef({});

  // clamp activeIndex whenever list changes
  useEffect(() => {
    setActiveIndex((prev) =>
      Math.max(0, Math.min(prev, Math.max(0, flatResults.length - 1)))
    );
  }, [flatResults.length]);

  useEffect(() => {
    const active = getId(flatResults[activeIndex]);
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
    if (!id) return;
    dispatch(updateCurrentId(id));
    if (query) saveRecentSearch(query);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const id = getId(flatResults[activeIndex]);
      if (id) handleSelect(id);
    } else if (e.key === "Escape") {
      if (onClose) onClose();
    }
  };

  const clearQuery = () => setQuery("");
  const clickRecent = (text) => setQuery(text);

  return (
    <div className="w-full md:w-xl bg-[var(--bg)] rounded-lg shadow p-2">
      <div className="p-2 border-b border-gray-700 flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={clearQuery}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Search chats..."
        />
      </div>

      <div className="py-2">
        <div className="px-2 h-[46vh] overflow-y-auto overflow-x-hidden">
          {query.trim() === "" ? (
            <div>
              <RecentSearches items={recentSearches} onClick={clickRecent} />

              <div className="select-none text-gray-400 px-2 mb-2">
                Recent conversations
              </div>
              {conversationsSorted.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  No conversations yet
                </div>
              ) : (
                conversationsSorted.map((conversation) => {
                  const id = getId(conversation);
                  const lastMessage = conversation.messages?.length
                    ? conversation.messages[conversation.messages.length - 1]
                    : null;
                  return (
                    <div
                      key={id}
                      ref={(el) => (itemRefs.current[id] = el)}
                      onClick={() =>
                        handleSelect(conversation._id || conversation.id)
                      }
                      className="p-2 rounded-xl cursor-pointer hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
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
            <div className="select-none text-center text-gray-500 py-8">
              😕 No matches found — try different words
            </div>
          ) : (
            <ResultsList
              titleMatches={grouped.titleMatches}
              messageMatches={grouped.messageMatches}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              flatResults={flatResults}
              itemRefs={itemRefs}
              onSelect={(conv) => handleSelect(conv._id || conv.id)}
              query={query}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchChats;
