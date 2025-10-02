const SearchInput = ({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder,
  autoFocus,
}) => {
  return (
    <>
      <input
        className="w-full pr-10 bg-transparent focus:outline-none px-3 py-2"
        placeholder={placeholder}
        name="query"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        aria-label="clear"
        onClick={onClear}
        className="flex px-2 py-1 rounded-xl cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)] mr-10"
      >
        Clear
      </button>
    </>
  );
};

export default SearchInput;
