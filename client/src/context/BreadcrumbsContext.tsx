import { createContext, ReactNode, useState } from "react"
import { BreadCrumbsContextType, CrumbType } from "./types";

export const BreadcrumbsContext = createContext<BreadCrumbsContextType | undefined>(undefined)

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [crumbs, setCrumbs] = useState<CrumbType[]>([]);

  const resetCrumbs = (newCrumbs: CrumbType[] = []) => {
    setCrumbs(newCrumbs);
  }

  const addCrumb = (crumb: CrumbType) => {
    setCrumbs(prev => [...prev, crumb])
  }

  const popCrumb = () => {
    setCrumbs(prev => prev.slice(0, -1));
  }

  const getActiveStateByIndex = (index: number) => {
    return index < crumbs.length - 1;
  }

  return (
    <BreadcrumbsContext.Provider value={{ reset: resetCrumbs, push: addCrumb, pop: popCrumb, isActive: getActiveStateByIndex, crumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  )
}
