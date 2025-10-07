"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/components/avatar";
import { useState } from "react";
import { User } from "lucide-react";

export default function NavbarClient({ fullName }: { fullName: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    const r = await fetch("/api/logout", { method: "POST" });
    if (r.ok) {
      setLoggingOut(true);
      router.refresh();
    } else {
      setLoggingOut(false);
    }
  }
  if (loggingOut) return null;
  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/books" className="text-lg font-semibold">
          FlashcardAI
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/books">Books</Link>
          </Button>

          <span className="text-sm">{fullName}</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="User menu" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
