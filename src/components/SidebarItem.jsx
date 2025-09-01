function SidebarItem({ action, title, Icon }) {
  return (
    <div
      className="flex items-center gap-2 mx-2 cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-xl"
      onClick={action}
    >
      {Icon && <Icon />}
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

export default SidebarItem;
