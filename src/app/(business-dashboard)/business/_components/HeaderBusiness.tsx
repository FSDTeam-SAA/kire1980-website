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

import { Skeleton } from "@/components/ui/skeleton";
import { Search, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function DashboardHeaderBusiness() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [query, setQuery] = useState("");

  const loading = false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // Add your search logic or routing here (e.g., router.push(`/search?q=${query}`))
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
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-sm h-10 items-stretch"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-grow px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-12 bg-[#1a999e] hover:bg-[#147e82] text-white rounded-r-lg border border-[#1a999e] transition-colors"
        >
          <Search size={18} strokeWidth={2.5} />
        </button>
      </form>
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <Avatar className="cursor-pointer">
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
