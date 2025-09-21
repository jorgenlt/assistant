import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchConversationsThunk } from "./features/chat/chatSlice";
import { setIsSearchOpen } from "./features/menu/menuSlice";
import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import Login from "./features/auth/Login";
import Loader from "./components/Loader";

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { theme, isThemeDark } = useSelector((state) => state.menu);
  const fetchConversationsStatus = useSelector(
    (state) => state.chat.fetchConversationsStatus
  );

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        dispatch(setIsSearchOpen(true));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex h-screen bg-[var(--bg2)] text-[var(--text)]">
      {fetchConversationsStatus === "loading" ? (
        <Loader isThemeDark={isThemeDark} />
      ) : !isAuth ? (
        <Login />
      ) : (
        <>
          <Menu />
          <Chat />
        </>
      )}
    </div>
  );
};

export default App;
