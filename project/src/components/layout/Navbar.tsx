
import { Link } from "react-router-dom"
import { Home, DollarSign, PiggyBank } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-foreground/80"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/converter"
            className="flex items-center gap-2 hover:text-foreground/80"
          >
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">Converter</span>
          </Link>
          <Link
            to="/budget"
            className="flex items-center gap-2 hover:text-foreground/80"
          >
            <PiggyBank className="h-5 w-5" />
            <span className="font-medium">Budget</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 