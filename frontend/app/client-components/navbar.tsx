import { TwitchIcon } from "@/components/icons"
import { Button } from "@/components/button"

export function Navbar() {
  return (
    <nav className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <TwitchIcon className="w-7 h-7 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Clip Catchup</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-foreground hover:text-foreground">
          Settings
        </Button>
      </div>
    </nav>
  )
}
