import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state) => state.menu.theme) || "light";
  const isThemeDark = /dark/.test(theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", isThemeDark);
    root.setAttribute("data-theme", theme);
  }, [theme, isThemeDark]);

  return (
    <div className="flex h-screen">
      <Menu />
      <Chat />
    </div>
  );
}

export default App;
