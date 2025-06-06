import { BreadcrumbsContext } from "@/context/BreadcrumbsContext";
import { useContext } from "react";

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }
  return context;
};