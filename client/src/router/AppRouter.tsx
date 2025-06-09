import React from "react";
import { Route, Routes } from "react-router-dom";

import { routes } from "./routeConfig";
import { LoggedInLayout } from "@/layouts/LoggedinLayout";
import { LoginPage } from "@/pages/LoginPage";
import { AuthLayout } from "@/layouts/AuthLayout";
import { SignupPage } from "@/pages/SignupPage";
import { HomePage } from "@/pages/HomePage";
import { ChatPage } from "@/pages/chat-page/ChatPage";
import { FilesPage } from "@/pages/FilesPage";
import { PeoplePage } from "@/pages/PeoplePage";
import { VerifyAccountPage } from "@/pages/VerifyAccountPage";
import { PersonPage } from "@/pages/PersonPage";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.auth} element={<AuthLayout />} >
        <Route path={routes.signup} element={<SignupPage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.verifyAccount} element={<VerifyAccountPage />} />
      </Route>
      <Route element={<LoggedInLayout />} >
        <Route index element={<HomePage/>} />
        <Route path={routes.chat} element={<ChatPage />} />
        <Route path={routes.files} element={<FilesPage />} />
        <Route path={routes.people} element={<PeoplePage />} />
        <Route path={routes.person} element={<PersonPage /> } />
      </Route>
    </Routes>
  )
}