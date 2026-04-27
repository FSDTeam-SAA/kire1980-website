"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          element: string,
        ) => void;
      };
    };
  }
}

const SOURCE_LANGUAGE = "en";
const LANGUAGE_STORAGE_KEY = "bookersi-language";

const languages = [
  { code: "en", label: "English" },
  { code: "mk", label: "Macedonian" },
  { code: "bg", label: "Bulgarin" },
  { code: "el", label: "Greece" },
  { code: "sq", label: "Albania" },
  { code: "sr", label: "Serbian" },
  { code: "tr", label: "Turkish" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
] as const;

type LanguageCode = (typeof languages)[number]["code"];

function getSavedLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return languages.some((item) => item.code === savedLanguage)
    ? (savedLanguage as LanguageCode)
    : "en";
}

function setGoogleTranslateCookie(languageCode: LanguageCode) {
  const cookieValue = `/${SOURCE_LANGUAGE}/${languageCode}`;
  const expires = "max-age=31536000";
  document.cookie = `googtrans=${cookieValue}; path=/; ${expires}`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}; ${expires}`;
}

function resetGoogleTranslateToolbar() {
  document.body.style.top = "0px";
  const toolbarFrame = document.querySelector<HTMLIFrameElement>(
    "iframe.goog-te-banner-frame, iframe.skiptranslate",
  );
  if (toolbarFrame) {
    toolbarFrame.style.display = "none";
  }
}

function applyGoogleTranslate(languageCode: LanguageCode, retries = 12) {
  setGoogleTranslateCookie(languageCode);
  resetGoogleTranslateToolbar();

  const translateSelect =
    document.querySelector<HTMLSelectElement>(".goog-te-combo");

  if (!translateSelect) {
    if (retries > 0) {
      window.setTimeout(
        () => applyGoogleTranslate(languageCode, retries - 1),
        250,
      );
    }
    return;
  }

  translateSelect.value = languageCode;
  translateSelect.dispatchEvent(new Event("change"));
  window.setTimeout(resetGoogleTranslateToolbar, 250);
}

export default function DashboardHeaderBusiness() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(getSavedLanguage());

  const loading = false;

  const selectedLanguage = useMemo(
    () => languages.find((item) => item.code === language)?.label ?? "English",
    [language],
  );

  // Google Translate initialization
  useEffect(() => {
    const initialLanguage = getSavedLanguage();

    setGoogleTranslateCookie(initialLanguage);

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: SOURCE_LANGUAGE,
          includedLanguages: languages.map((item) => item.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element",
      );

      window.setTimeout(() => applyGoogleTranslate(getSavedLanguage()), 100);
    };

    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
      return;
    }

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    window.setTimeout(() => applyGoogleTranslate(initialLanguage), 100);
  }, []);

  const handleLanguageChange = (value: string) => {
    const nextLanguage = value as LanguageCode;
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setGoogleTranslateCookie(nextLanguage);
    window.location.reload();
  };

  const handleLogout = () => {
    signOut();
    setLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-5 bg-white rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <header className="w-full h-[100px] bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden" />

      <div className="flex items-center justify-end w-full gap-4">
        {/* Language Switcher */}
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger
            aria-label="Select language"
            className="notranslate h-[44px] rounded-xl border border-primary bg-white/90 px-4 text-primary shadow-none transition hover:bg-primary/10 min-w-[150px]"
          >
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <SelectValue>{selectedLanguage}</SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="notranslate z-[60] bg-white">
            {languages.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* User Avatar */}
        <Avatar
          className="cursor-pointer"
          onClick={() => setLogoutDialogOpen(true)}
        >
          <AvatarImage src="/avatar.png" alt="User Avatar" />
          <AvatarFallback>
            <User2Icon />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogTrigger asChild>
          <button style={{ display: "none" }}></button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
