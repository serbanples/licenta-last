import { Suggestion } from "@/data-types/general"
import { UserContext, UserState } from "@/services/types"
import { JSX } from "react"

export type ToastContextType = {
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  loading: (message: string) => string | number
  custom: (content: JSX.Element, options?: {
    duration?: number
    className?: string
    dismissible?: boolean
  }) => void
  dismiss: (toastId: string | number) => void,
  generic: () => void
  action: (message: string, action: () => void) => void
}

export interface AuthContextType {
  setUser: (user: UserContext)=> void;
  deleteUser: () => void;
  getUser: () => UserState | undefined;
  refreshUser: () => void;
}

export type LoadingContextType = {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export interface SearchContextType {
  searchTerm: string;
  suggestTerm: string;
  suggestions: Suggestion[];
  setSearchTerm: (term: string) => void;
  setSuggestTerm: (term: string) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  clearSearch: () => void;
  wasReset: boolean;
}

export interface BreadCrumbsContextType {
  reset: (crumbs?: CrumbType[]) => void;
  push: (crumb: CrumbType) => void;
  pop: () => void;
  isActive: (index: number) => boolean;
  crumbs: CrumbType[]
}

export interface CrumbType {
  id: string,
  linkTo: string,
  label: string
}