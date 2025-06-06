import { Breadcrumbs } from "@/components/custom/breadcrumbs"
import { Topbar } from "@/components/ui/topbar"
import { BreadcrumbsProvider } from "@/context/BreadcrumbsContext"
import { SearchProvider } from "@/context/SearchContext"
import { useAuth } from "@/hooks"
import { routes } from "@/router/routeConfig"
import React from "react"
import { Outlet, useNavigate } from "react-router-dom"

export const LoggedInLayout: React.FC = () => {
  const { getUser } = useAuth()
  const user = getUser()
  const navigate = useNavigate()

  if (user && user.loggedIn === false) {
    navigate(routes.login, { replace: true })
  }

  return (
    <SearchProvider>
      <BreadcrumbsProvider>
        <div className="flex flex-col h-screen">
          <Topbar />
          <div className="flex-1 overflow-y-auto bg-[#f5f5f5]">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
      </BreadcrumbsProvider>
    </SearchProvider>
  )
}
