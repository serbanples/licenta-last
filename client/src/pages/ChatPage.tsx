import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { routes } from "@/router/routeConfig";
import React, { useEffect } from "react";

export const ChatPage: React.FC = () => {
  const { reset } = useBreadcrumbs();

  useEffect(() => {
    reset([{ id: 'people', label: 'Chats', linkTo: routes.people }]);
  }, [])

  return (
    <div>CHAT</div>
  )
}