import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const { theme, isThemeDark } = useSelector((state) => state.menu);

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
