"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Session {
  session?: {
    user?: {
      username?: string
      role?: string
      isPremium?: boolean
    }
  } | null
}
const Header = ({ session }: Session) => {
  const pathname = usePathname()
  const isAgent = pathname.includes("/agent")
  const workspace = isAgent ? "Agent workspace" : "Admin workspace"
  const context = isAgent
    ? session?.user?.isPremium
      ? "Manage your listings, residents, and client relationships."
      : "Manage your listings and client relationships."
    : "Monitor First Estates users, agents, and platform activity."

  return (
    <header className="mt-4 flex w-full items-center gap-1 px-1 pb-2 sm:gap-4 sm:px-2">
      <Link
        href="/"
        aria-label="Go to First Estates home"
        className="group flex shrink-0 items-center"
      >
        <Image
          src="/logo/logoWithoutText.png"
          alt="logo"
          width={1000}
          height={1000}
          className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-card font-semibold uppercase tracking-[0.18em] text-primary/70">
          {workspace}
        </p>
        <h2 className="mt-1 truncate font-list text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome, {session?.user?.username || "there"}
        </h2>
        <p className="mt-1 max-w-2xl truncate text-sm leading-6 text-muted-foreground">{context}</p>
      </div>
    </header>
  )
}

export default Header
