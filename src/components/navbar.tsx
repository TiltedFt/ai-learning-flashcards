
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          FlashcardAI
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">HEHE</span>

          <Button asChild variant="ghost" size="icon" title="Profile">
            <Link href="/profile" aria-label="Profile">
              <Avatar className="h-6 w-6">
                <AvatarFallback>Hello</AvatarFallback>
              </Avatar>
            </Link>
          </Button>

        
        </div>
      </div>
    </header>
  )
}
