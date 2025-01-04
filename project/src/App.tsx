import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/layout/Navbar"
import DashboardPage from "./pages/dashboard/page"
import ConverterPage from "./pages/converter/page"
import BudgetPage from "./pages/budget/page"
import { Footer } from "./components/layout/Footer"
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/budget" element={<BudgetPage />} />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}
