import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { updateCurrentId } from "./features/chat/chatSlice";
import {
  fetchConversationsThunk,
  deleteConversationThunk,
} from "./features/chat/chatThunks";
import {
  setIsMenuOpen,
  setIsSearchOpen,
  setIsKeyboardShortcutsOpen,
  setIsMobile,
} from "./features/menu/menuSlice";
import { setProvider, setModel } from "./features/providers/providersSlice";
import { pingServer } from "./features/server/serverSlice";
import Menu from "./features/menu/Menu";
import Chat from "./features/chat/Chat";
import Login from "./features/auth/Login";
import Loader from "./components/Loader";
import Modal from "./components/Modal";
import SearchChats from "./features/menu/components/SearchChats";
import KeyboardShortcuts from "./features/menu/components/KeyboardShortcuts";
import { useWindowSize } from "react-use";

const App = () => {
  const serverStatus = useSelector((state) => state.server.status);
  const { isAuth, authStatus, user } = useSelector((state) => state.auth);
  const providers = useSelector((state) => state.providers);
  const {
    theme,
    isThemeDark,
    isMenuOpen,
    isSearchOpen,
    isKeyboardShortcutsOpen,
  } = useSelector((state) => state.menu);
  const currentId = useSelector((state) => state.chat.currentId);
  const fetchConversationsStatus = useSelector(
    (state) => state.chat.fetchConversationsStatus
  );
  const isMobile = useWindowSize().width < 767;

  const dispatch = useDispatch();

  const handleOnCloseSearch = () => {
    dispatch(setIsSearchOpen(false));
    if (isMobile) dispatch(setIsMenuOpen(false));
  };

  // Set provider and model once at login
  // const initialized = useRef(false);
  // useEffect(() => {
  //   if (isAuth && !initialized.current) {
  //     initialized.current = true;

  //     const apiKeys = user.apiKeys || [];

  //     if (apiKeys.length > 0) {
  //       const provider = apiKeys[0];
  //       const model = providers[provider].models[0];

  //       dispatch(setProvider({ provider }));
  //       dispatch(setModel({ provider, model }));
  //     }
  //   }
  // }, [isAuth, user, providers, dispatch]);

  useEffect(() => {
    dispatch(pingServer());
  }, [dispatch]);

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
    dispatch(setIsMenuOpen(!isMobile));
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

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
        if (currentId) {
          event.preventDefault();
          dispatch(deleteConversationThunk(currentId));
          dispatch(updateCurrentId(null));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="flex h-dvh w-screen bg-[var(--bg2)] text-[var(--text)]">
      {serverStatus === "loading" ? (
        <Loader isThemeDark={isThemeDark} text="Waiting for server..." />
      ) : fetchConversationsStatus === "loading" || authStatus === "loading" ? (
        <Loader isThemeDark={isThemeDark} />
      ) : !isAuth ? (
        <Login />
      ) : (
        <>
          <div
            className={`
            h-dvh transition-transform duration-300 ease-in-out
            ${isMobile ? "fixed top-0 left-0 z-20" : "relative"}
            ${
              isMobile
                ? isMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : ""
            }
         
            bg-[var(--bg2)] shadow-xl w-4/5 max-w-xs md:w-xs
          `}
          >
            <Menu />
          </div>

          {/* Chat flexes into remaining space */}
          <div className="flex-1 flex flex-col w-full overflow-hidden">
            <Chat />
          </div>
        </>
      )}

      {/* Search modal */}
      <Modal open={isSearchOpen} onClose={handleOnCloseSearch}>
        <SearchChats onClose={handleOnCloseSearch} />
      </Modal>

      {/* Keyboard shortcuts */}
      <Modal
        title="Keyboard shortcuts"
        open={isKeyboardShortcutsOpen}
        onClose={() => dispatch(setIsKeyboardShortcutsOpen(false))}
      >
        <KeyboardShortcuts />
      </Modal>
    </div>
  );
};

export default App;
