import { useState } from "react";

const SearchChats = () => {
  const [query, setQuery] = useState("");

  return (
    <div>
      <div className="border-b-1 border-b-gray-700 py-2">
        <input autoFocus value={query} onChange={(e) => setQuery(e.value)} />
      </div>
      <div className="py-2 h-[40vh] overflow-y-scroll overflow-x-hidden">
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
        <div className="p-2 rounded-xl hover:bg-[var(--hover)]">
          <p>... result ...</p>
        </div>
      </div>
    </div>
  );
};

export default SearchChats;
