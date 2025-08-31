import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const theme = useSelector((state) => state.menu.theme);
  console.log("🚀 ~ theme:", theme)

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex">
      <Menu />
      <Chat />
    </div>
  );
}

export default App;
