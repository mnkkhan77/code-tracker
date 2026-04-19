import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/ThemeProvider";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";

// Three layers per palette: background (darkest tint) → sidebar → card/navbar (lightest)
const BG_COLORS = [
  {
    name: "Forest",
    value: "140 25% 82%",
    card: "140 15% 96%",
    sidebar: "140 20% 89%",
    preview: "140 45% 55%",
  },
  {
    name: "Rose",
    value: "345 40% 80%",
    card: "345 20% 96%",
    sidebar: "345 28% 87%",
    preview: "345 55% 65%",
  },
  {
    name: "Ocean",
    value: "205 45% 78%",
    card: "205 22% 95%",
    sidebar: "205 32% 85%",
    preview: "205 60% 55%",
  },
  {
    name: "Peach",
    value: "25  55% 80%",
    card: "25  25% 96%",
    sidebar: "25  38% 87%",
    preview: "25  70% 62%",
  },
  {
    name: "Lavender",
    value: "265 38% 80%",
    card: "265 18% 96%",
    sidebar: "265 26% 87%",
    preview: "265 55% 65%",
  },
  {
    name: "Amber",
    value: "38  55% 78%",
    card: "38  22% 96%",
    sidebar: "38  35% 85%",
    preview: "38  70% 58%",
  },
  {
    name: "Teal",
    value: "175 40% 77%",
    card: "175 18% 95%",
    sidebar: "175 28% 84%",
    preview: "175 55% 50%",
  },
  {
    name: "Slate",
    value: "215 35% 78%",
    card: "215 15% 96%",
    sidebar: "215 24% 85%",
    preview: "215 55% 55%",
  },
];

const STORAGE_KEY = "light-bg-color";
const DEFAULT = "140 25% 82%";

function applyColor(entry: (typeof BG_COLORS)[number]) {
  const root = document.documentElement;
  root.style.setProperty("--background", entry.value);
  root.style.setProperty("--card", entry.card);
  root.style.setProperty("--sidebar", entry.sidebar);
}

function resetColor() {
  const root = document.documentElement;
  root.style.removeProperty("--background");
  root.style.removeProperty("--card");
  root.style.removeProperty("--sidebar");
}

export function BgColorPicker() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const valid = BG_COLORS.find((c) => c.value === stored);
    if (!valid) localStorage.removeItem(STORAGE_KEY);
    return valid ? stored! : DEFAULT;
  });

  useEffect(() => {
    if (theme === "dark") {
      resetColor();
      return;
    }
    const entry = BG_COLORS.find((c) => c.value === selected) ?? BG_COLORS[0];
    applyColor(entry);
  }, [theme, selected]);

  const apply = (entry: (typeof BG_COLORS)[number]) => {
    setSelected(entry.value);
    localStorage.setItem(STORAGE_KEY, entry.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" title="Background color">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Background color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <p className="text-xs font-medium mb-2 text-muted-foreground">
          Light mode background
        </p>
        <div className="grid grid-cols-4 gap-2">
          {BG_COLORS.map((color) => (
            <button
              key={color.value}
              title={color.name}
              onClick={() => apply(color)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                selected === color.value
                  ? "border-primary ring-2 ring-primary ring-offset-1"
                  : "border-border",
              )}
              style={{ backgroundColor: `hsl(${color.preview})` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          {BG_COLORS.find((c) => c.value === selected)?.name}
        </p>
      </PopoverContent>
    </Popover>
  );
}
