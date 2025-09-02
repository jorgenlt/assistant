import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../features/menu/menuSlice";

const THEMES = ["light", "dark", "sunset"]; // add more as you like

function ThemeSwitcher() {
  const theme = useSelector((state) => state.menu.theme) ?? "light";
  const dispatch = useDispatch();

  const handleChangeTheme = (t) => {
    dispatch(setTheme(t));
  };

  // redux-persist will rehydrate the theme on load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div aria-label="theme switcher" style={{ display: "flex", gap: 8 }}>
      {THEMES.map((t) => (
        <button
          key={t}
          onClick={() => handleChangeTheme(t)}
          className="btn btn-sm btn-ghost" // optional: style as you like
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
