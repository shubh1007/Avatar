
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = (value: string) => {
    if (!value) return;
    
    const newTheme = value as "light" | "dark";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={toggleTheme}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg p-1"
      >
        <ToggleGroupItem
          value="light"
          className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary rounded-full"
          aria-label="Light mode"
        >
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="dark"
          className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary rounded-full"
          aria-label="Dark mode"
        >
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
