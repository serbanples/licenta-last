import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { routes } from "@/router/routeConfig";
import React, { useEffect } from "react";

export const FilesPage: React.FC = () => {
  const { reset } = useBreadcrumbs();

  useEffect(() => {
    reset([{ id: 'people', label: 'Files', linkTo: routes.files }]);
  }, [])

  return (
    <div>FILES</div>
  )
}