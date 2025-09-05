function SidebarItem({ action, title, Icon }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl mx-2 cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
      onClick={action}
    >
      {Icon && <Icon />}
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

export default SidebarItem;
