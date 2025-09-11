import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchConversationsThunk } from "./features/chat/chatSlice";
import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import Login from "./features/auth/Login";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { theme, isThemeDark } = useSelector((state) => state.menu);

  const dispatch = useDispatch();

  // Runs once on page load to set the initial theme class on root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(isThemeDark ? "dark" : "light");
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", isThemeDark);

    root.setAttribute("data-theme", theme);
  }, [theme, isThemeDark]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchConversationsThunk());
    }
  }, [isAuth, dispatch]);

  return (
    <div className="flex h-screen bg-[var(--bg2)] text-[var(--text)]">
      {!isAuth ? (
        <Login />
      ) : (
        <>
          <Menu />
          <Chat />
        </>
      )}
    </div>
  );
}

export default App;
