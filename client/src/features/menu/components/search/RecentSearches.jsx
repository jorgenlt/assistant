const RecentSearches = ({ items = [], onClick }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="select-none text-gray-400 px-2 mb-2">Recent searches</div>
      <div className="flex flex-wrap gap-2 px-2">
        {items.map((r) => (
          <button
            key={r}
            onClick={() => onClick(r)}
            className="flex px-2 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
