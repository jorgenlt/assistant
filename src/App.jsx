import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state) => state.menu.theme) || "light";

  useEffect(() => {
    const darkThemes = [
      "dark",
      "github-dark",
      "vscode-dark",
      "notion-dark",
      "slack-dark",
      "discord-dark",
      "material-dark",
      "jetbrains-dark",
      "one-dark",
      "dracula",
      "monokai",
    ];

    const root = document.documentElement;

    root.classList.toggle("dark", darkThemes.includes(theme));
    root.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex h-screen">
      <Menu />
      <Chat />
    </div>
  );
}

export default App;
