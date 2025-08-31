import { useState } from "react";

export default function Composer() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Send:", message);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full h-full max-w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white dark:bg-gray-800 shadow-md rounded-2xl p-3 grid grid-cols-[auto_1fr_auto] gap-2 items-center"
      >
        {/* Left action */}
        <button
          type="button"
          className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
        >
          Add
        </button>

        {/* Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          className="w-full resize-none rounded-md p-2 bg-transparent outline-none text-gray-900 dark:text-gray-100"
          rows={1}
        />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
          >
            Dictate
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
