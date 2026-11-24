import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoader } from '@/components/ui/Feedback'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { queryClient } from '@/lib/queryClient'
import { AuthCallbackPage } from '@/pages/auth/AuthCallbackPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { BillingPage } from '@/pages/dashboard/BillingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { DocumentDetailPage } from '@/pages/dashboard/DocumentDetailPage'
import { DocumentsPage } from '@/pages/dashboard/DocumentsPage'
import { HealthPage } from '@/pages/dashboard/HealthPage'
import { SettingsPage } from '@/pages/dashboard/SettingsPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageLoader label="Restoring your session…" />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster
            theme="dark"
            position="top-right"
            richColors
            toastOptions={{ className: '!bg-ink-900 !border-ink-700 !text-zinc-100' }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="documents/:id" element={<DocumentDetailPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="health" element={<HealthPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
