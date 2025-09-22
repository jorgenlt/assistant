import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchConversationsThunk,
  updateCurrentId,
  deleteConversationThunk,
} from "./features/chat/chatSlice";
import { setIsSearchOpen, setIsMenuOpen, setIsMobile } from "./features/menu/menuSlice";
import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import Login from "./features/auth/Login";
import Loader from "./components/Loader";
import { useWindowSize } from "react-use";

const App = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const { theme, isThemeDark } = useSelector((state) => state.menu);
  const currentId = useSelector((state) => state.chat.currentId);
  const fetchConversationsStatus = useSelector(
    (state) => state.chat.fetchConversationsStatus
  );
  const isMenuOpen = useSelector(state => state.menu.isMenuOpen)

  const isMobile = useWindowSize().width < 767;

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

  useEffect(() => {
    dispatch(setIsMenuOpen(!isMobile))
    dispatch(setIsMobile(isMobile))
  }, [isMobile, dispatch])
  

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl + k
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        dispatch(setIsSearchOpen(true));
      }

      // Ctrl + m
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        dispatch(updateCurrentId(null));
      }

      // Ctrl + shift + backspace
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "Backspace"
      ) {
        event.preventDefault();
        dispatch(deleteConversationThunk(currentId));
        dispatch(updateCurrentId(null));
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
          {isMenuOpen &&  <Menu />}
         
          <Chat />
        </>
      )}
    </div>
  );
};

export default App;
