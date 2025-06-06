import { useNavigate } from "react-router-dom"
import { ChevronDown, User, LogOut } from "lucide-react"
import { useToast, useAuth } from "@/hooks"
import { logout } from "@/services/auth"
import { routes } from "@/router/routeConfig"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"

export function AccountDropdown() {
  const toast = useToast()
  const navigate = useNavigate()
  const { deleteUser, getUser } = useAuth()
  const user = getUser()

  // Use React Query mutation for logout
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      deleteUser();
      navigate(routes.login, { replace: true });
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      const message = error?.message ?? 'Failed to logout';
      toast.error(message);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full border"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="!bg-inherit">
              {user?.user?.email?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={4}
        collisionPadding={8}
        avoidCollisions
        sticky='always'
        className="w-48"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(`/people/${user?.user?.id}?own-account=true`)}>
            <User className="mr-2 h-4 w-4" />
            My Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
