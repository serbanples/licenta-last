import { createContext, ReactNode, useState } from "react"
import { LoadingContextType } from "./types"
import { LoadingOverlay } from "@/components/ui/laoding-overlay"



export const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {isLoading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  )
}
