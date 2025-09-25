"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Monitor, Sun, Moon, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'zh', name: '中文 (Mandarin)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
];

export function SettingsSheet() {
  const { setTheme, theme } = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const storedFontSize = localStorage.getItem('app-font-size');
    if (storedFontSize) {
        const size = parseInt(storedFontSize, 10);
        setFontSize(size);
        root.style.fontSize = `${size}px`;
    }
  }, []);

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('app-font-size', String(newSize));
  };

  if (!mounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 mt-6">
            {/* Theme Settings */}
            <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} className="flex items-center gap-2">
                        <Sun className="size-4" /> Light
                    </Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} className="flex items-center gap-2">
                        <Moon className="size-4" /> Dark
                    </Button>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} className="flex items-center gap-2">
                        <Monitor className="size-4" /> System
                    </Button>
                </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-3">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Font Size Settings */}
            <div className="space-y-3">
                <Label>Font Size ({fontSize}px)</Label>
                <Slider
                    min={12}
                    max={20}
                    step={1}
                    defaultValue={[fontSize]}
                    onValueChange={handleFontSizeChange}
                />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
