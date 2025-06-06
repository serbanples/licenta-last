import { JSX, ReactNode, createContext } from 'react'
import { Toaster, toast } from 'sonner'
import { ToastContextType } from './types'
import { Loader2 } from 'lucide-react'

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, { description })
  }

  const showError = (message: string, description?: string) => {
    toast.error(message, { description })
  }

  const showInfo = (message: string, description?: string) => {
    toast.info(message, { description })
  }

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, { description })
  }

  const showGeneric = () => {
    toast.error('An error ocurred')
  }

  const showSuccessWithAction = (message: string, action: () => void) => {
    toast.success(message, {
      action: {
        label: 'Undo',
        onClick: () => {
          action()
        },
      },
    })
  }

  const showLoading = (message: string) => {
    return toast.loading(message, {
      duration: Infinity,
      className: "bg-background",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    })
  }

  const customToast = (content: JSX.Element, options?: {
    duration?: number;
    className?: string;
    dismissible?: boolean;
  }) => {
    toast.custom((id: string | number) => (
      <div className={`rounded-lg border bg-background p-4 ${options?.className ?? ''}`}>
        {content}
        {options?.dismissible && (
          <button 
            onClick={() => toast.dismiss(id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent"
          >
            ×
          </button>
        )}
      </div>
    ), {
      duration: options?.duration,
    })
  }

  const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId)
  }

  return (
    <ToastContext.Provider 
      value={{
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning,
        loading: showLoading,
        custom: customToast,
        dismiss: dismissToast,
        generic: showGeneric,
        action: showSuccessWithAction,
      }}
    >
      <Toaster 
        position="top-center"
        expand={false}
        richColors
        className="toaster group"
      />
      {children}
    </ToastContext.Provider>
  )
}