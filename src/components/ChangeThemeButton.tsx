import { FC, memo, useEffect, useState } from "react";
import { Button } from "./Button";

export const ChangeThemeButton: FC = memo(() => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? "🌙" : "☀️"}
    </Button>
  )
})