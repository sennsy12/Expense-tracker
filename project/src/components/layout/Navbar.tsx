import { Link, useLocation } from "react-router-dom"
import { Home, DollarSign, PiggyBank, Menu, Target, BarChart } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { to: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { to: "/converter", icon: <DollarSign className="h-5 w-5" />, label: "Converter" },
    { to: "/budget", icon: <PiggyBank className="h-5 w-5" />, label: "Budget" },
    { to: "/goals", icon: <Target className="h-5 w-5" />, label: "Goals" },
    { to: "/net-worth", icon: <BarChart className="h-5 w-5" />, label: "Net Worth" },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
        >
          FinanceFlow
        </Link>
        
        {!isLandingPage && (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 hover:text-foreground/80"
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-accent rounded-md"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute top-[calc(100%+1px)] left-0 right-0 border-b bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center gap-2 hover:text-foreground/80 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  )
} 