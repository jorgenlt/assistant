const Button = ({ onClick, title, Icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl active:scale-90 hover:bg-[var(--hover)] text-[var(--text)] hover:text-[var(--text-hover)]"
    >
      {Icon && <Icon size={18} />}
      {title}
    </button>
  );
};

export default Button;
