import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/layout/Navbar"
import DashboardPage from "./pages/dashboard/page"
import ConverterPage from "./pages/converter/page"
import BudgetPage from "./pages/budget/page"
import LandingPage from "./pages/landing/page"
import GoalsPage from "./pages/goals/page"
import { Footer } from "./components/layout/Footer"
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/goals" element={<GoalsPage />} />
            </Routes>
            <Footer />
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}
