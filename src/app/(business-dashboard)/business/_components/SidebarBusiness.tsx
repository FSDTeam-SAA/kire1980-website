"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LogOut,
  SendToBack,
  Settings,
  ShoppingBag,
  DollarSign,
  Star,
  Calendar,
  UserRoundPen,
  CalendarDays,
} from "lucide-react";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navigation = [
  { name: "Dashboard Overview", href: "/business", icon: SendToBack },
  {
    name: "Service Management",
    href: "/business/service-management",
    icon: ShoppingBag,
  },
  {
    name: "Staff Management",
    href: "/business/staff-management",
    icon: UserRoundPen,
  },
  {
    name: "Booking Calendar",
    href: "/business/booking-calendar",
    icon: CalendarDays,
  },
  {
    name: "Booking Management",
    href: "/business/booking-management",
    icon: Calendar,
  },
  { name: "Reviews & Ratings", href: "/business/review-ratings", icon: Star },
  { name: "Earnings", href: "/business/earnings", icon: DollarSign },
  { name: "Settings", href: "/business/setting", icon: Settings },
];

export default function SidebarBusiness() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
    setOpen(false);
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-[#FFFFFF] border-r border-gray-200 fixed">
      {/* Logo */}
      <div className="flex items-center py-1 justify-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="ABC Nerd Logo"
            width={162}
            height={162}
            className="h-[120px] w-[120px] rounded-full object-cover"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((item) => {
          let isActive = false;

          if (item.href === "/business") {
            isActive = pathname === "/business";
          } else {
            isActive = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 text-base leading-[150%] tracking-[0%] font-semibold transition-colors",
                isActive
                  ? "bg-[#159A9C] text-[#FFFFFF] font-bold text-[16px]"
                  : "text-[#1E2A2A] hover:bg-[#159A9C]/50 hover:text-[#FFFFFF] font-normal",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 px-4 cursor-pointer rounded-lg font-medium text-[#e5102e] hover:bg-[#feecee] hover:text-[#e5102e] transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
