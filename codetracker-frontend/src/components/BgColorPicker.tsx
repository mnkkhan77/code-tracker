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

// Three layers per palette: background (subtle tint) → sidebar → card (near-white)
const BG_COLORS = [
  {
    name: "Forest",
    value: "140 10% 94%",
    card: "0 0% 99%",
    sidebar: "140 13% 91%",
    preview: "140 45% 50%",
  },
  {
    name: "Rose",
    value: "345 12% 94%",
    card: "0 0% 99%",
    sidebar: "345 16% 91%",
    preview: "345 55% 60%",
  },
  {
    name: "Ocean",
    value: "205 14% 93%",
    card: "0 0% 99%",
    sidebar: "205 19% 90%",
    preview: "205 60% 50%",
  },
  {
    name: "Peach",
    value: "25  16% 94%",
    card: "0 0% 99%",
    sidebar: "25  22% 91%",
    preview: "25  70% 58%",
  },
  {
    name: "Lavender",
    value: "265 11% 94%",
    card: "0 0% 99%",
    sidebar: "265 15% 91%",
    preview: "265 55% 60%",
  },
  {
    name: "Amber",
    value: "38  14% 94%",
    card: "0 0% 99%",
    sidebar: "38  19% 91%",
    preview: "38  70% 52%",
  },
  {
    name: "Teal",
    value: "175 12% 93%",
    card: "0 0% 99%",
    sidebar: "175 16% 90%",
    preview: "175 55% 45%",
  },
  {
    name: "Slate",
    value: "215 10% 93%",
    card: "0 0% 99%",
    sidebar: "215 14% 90%",
    preview: "215 55% 50%",
  },
];

const STORAGE_KEY = "light-bg-color";
const DEFAULT = "140 10% 94%";

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
