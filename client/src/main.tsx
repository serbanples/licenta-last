import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './router/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './context/ToastProvider'
import { LoadingProvider } from './context/LoadingContext'
import { AuthProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <LoadingProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LoadingProvider>
    </StrictMode>,
  </QueryClientProvider>
)
