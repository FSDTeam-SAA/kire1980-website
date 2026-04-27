/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Globe, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const pathname = usePathname();
  const session = useSession();
  const role = session?.data?.user?.role;
  const isHomePage = pathname === "/";
  const showSolidNavbar = !isHomePage || isScrolled || isOpen;

  const selectedLanguage = useMemo(
    () => languages.find((item) => item.code === language)?.label ?? "English",
    [language],
  );

  // Initialize language from localStorage after mount
  useEffect(() => {
    setLanguage(getSavedLanguage());
  }, []);

  // Google Translate initialization
  useEffect(() => {
    const initialLanguage = getSavedLanguage();

    setGoogleTranslateCookie(initialLanguage);

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

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

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (value: string) => {
    const nextLanguage = value as LanguageCode;
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setGoogleTranslateCookie(nextLanguage);
    window.location.reload();
  };

  const languageSwitcher = (className = "") => (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger
        aria-label="Select language"
        className={`notranslate h-[44px] rounded-xl border border-primary bg-white/90 px-4 text-primary shadow-none transition hover:bg-primary/10 ${className}`}
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
  );

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        showSolidNavbar
          ? "border-b border-gray-200 bg-white shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div id="google_translate_element" className="hidden" />
      <div className="container mx-auto flex h-[90px] items-center justify-between px-4">
        {/* Left Logo */}
        <Link href={`/`}>
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Bookersi Logo"
              width={1000}
              height={1000}
              priority
              className="h-auto w-[140px] object-contain md:w-[120px] lg:mt-4"
            />
          </div>
        </Link>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {/* Language */}
          {languageSwitcher("min-w-[170px]")}

          {/* Login / User Menu */}
          {session?.data?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                {session.data.user.profileImage ? (
                  <Image
                    src={session.data.user.profileImage}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {userMenu && (
                <div className="absolute right-0 mt-3 w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    href={
                      role === "customer"
                        ? "/user/profile"
                        : role === "businessowner"
                          ? "/business"
                          : "#"
                    }
                    className="block px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={"/login"} className="hover:cursor-pointer">
              <button className="rounded-xl bg-primary px-6 py-3 text-[16px] font-semibold text-white transition hover:opacity-90 cursor-pointer">
                Log in
              </button>
            </Link>
          )}

          {/* CTA */}
          {role === "customer" && (
            <Link href={`/list-your-business`}>
              <button className="h-[44px] rounded-xl bg-primary px-6 text-[16px] font-semibold text-white transition hover:opacity-90 cursor-pointer">
                List Your Business
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition ${
              showSolidNavbar
                ? "text-primary hover:bg-primary/10"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {/* Language */}
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger
                  aria-label="Select language"
                  className="notranslate w-full h-[54px] rounded-xl border border-gray-100 bg-gray-50 text-[#1F2937] shadow-none"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    <SelectValue>{selectedLanguage}</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent className="notranslate z-[60] bg-white">
                  {languages.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action Buttons / User Menu */}
              {session?.data?.user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href={
                      role === "customer"
                        ? "/user/profile"
                        : role === "businessowner"
                          ? "/business"
                          : "#"
                    }
                    className="w-full h-[54px] flex items-center justify-center text-[16px] font-semibold text-[#1F2937] border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full h-[54px] flex items-center justify-center text-[16px] font-semibold text-red-500 border border-gray-100 rounded-xl hover:bg-gray-50 transition"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                  {role === "customer" && (
                    <Link href="/list-your-business">
                      <button className="w-full h-[54px] rounded-xl bg-primary text-[16px] font-semibold text-white hover:opacity-90 transition shadow-sm">
                        List Your Business
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login">
                    <button className="w-full cursor-pointer h-[54px] flex items-center justify-center text-[16px] font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition">
                      Log in
                    </button>
                  </Link>
                  <button className="w-full h-[54px] rounded-xl bg-primary text-[16px] font-semibold text-white hover:opacity-90 transition shadow-sm">
                    List Your Business
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
