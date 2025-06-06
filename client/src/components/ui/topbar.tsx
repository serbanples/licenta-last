import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Bell, Home, MessageSquare, FolderIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/hooks/useSearch"
import { SearchBar } from "./searchbar"
import { AccountDropdown } from "../custom/account-dropdown"
import { Tabs, TabsList, TabsTrigger } from "./animated-tabs"

const routes = [
  { path: "/", label: "Home", icon: Home },
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/files", label: "Files", icon: FolderIcon },
  { path: "/people", label: "People", icon: Users },
] as const

const pagesWithSearch = ["/chat", "/files", "/people"]

export function Topbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { clearSearch } = useSearch()

  useEffect(() => {
    clearSearch()
  }, [pathname])

  return (
    <header
      className="
        sticky top-0 z-50 w-full border-b
        bg-background/95 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
        overflow-visible
      "
    >
      <div className="flex h-14 items-center justify-between px-5">
        <div className="flex flex-1 items-center gap-6">
          <Tabs value={pathname} onValueChange={(v) => navigate(v)}>
            <TabsList>
              {routes.map(({ path, label, icon: Icon }) => (
                <TabsTrigger key={path} value={path} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {pagesWithSearch.includes(pathname) && (
            <div className="flex-1 max-w-sm">
              <SearchBar
                placeholder={`Search ${pathname.slice(1)}...`}
                debounceTime={500}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <AccountDropdown />
        </div>
      </div>
    </header>
  )
}
