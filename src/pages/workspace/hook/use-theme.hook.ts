import React, { useEffect } from "react";
import useLocalStorage from "../../../hooks/use-local-storage";

export default function useTheme() {
  const storage = useLocalStorage("theme");
  const [darkMode, setDarkMode] = React.useState(false);
  function initTheme() {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      storage.value === "dark" ||
      !window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }

  useEffect(() => {
    initTheme();
  }, [storage]);

  function toggleTheme() {
    if (storage.value === "light") {
      document.documentElement.classList.add("dark");
      storage.setValue("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      storage.setValue("light");
      setDarkMode(false);
    }
  }

  return { toggleTheme, darkMode };
}
