const KeyboardShortcuts = () => {
  const Shortcut = ({ description, keys }) => {
    return (
      <div className="flex justify-between select-none">
        <span>{description}</span>
        <span>{keys}</span>
      </div>
    );
  };

  return (
    <div>
      <div className="p-4 flex flex-col gap-2">
        <Shortcut description="Search chats" keys="Ctrl/Cmd + K" />
        <Shortcut description="Send message" keys="Ctrl/Cmd + Enter" />
        <Shortcut description="New chat" keys="Ctrl/Cmd + M" />
        <Shortcut description="Delete chat" keys="Ctrl/Cmd + Shift + Backspace" />
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
