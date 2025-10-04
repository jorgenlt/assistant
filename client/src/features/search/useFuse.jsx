import { useMemo } from "react";
import Fuse from "fuse.js";

// small hook that returns Fuse results and the fuse instance
const useFuse = (conversations, query) => {
  const fuse = useMemo(() => {
    return new Fuse(conversations, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "messages.content", weight: 0.4 },
      ],
      includeMatches: true,
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
      useExtendedSearch: true,
    });
  }, [conversations]);

  const results = useMemo(() => {
    if (!query || !query.trim()) return [];
    try {
      return fuse.search(query, { limit: 100 });
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [fuse, query]);

  return { results, fuse };
};

export default useFuse;
