import { useAuth } from "@/hooks";
import { routes } from "@/router/routeConfig";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  const { getUser } = useAuth();
  const user = getUser();
  const navigate = useNavigate();

  if(user && user.loggedIn === true) {
    navigate(routes.home, { replace: true });
  }

  return (
    <Outlet />
  )
}