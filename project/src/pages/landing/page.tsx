import { ArrowRight, PiggyBank, LineChart, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-primary/10 p-2">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Take Control of Your{" "}
          <span className="text-primary">Finances</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[42rem]">
          Track expenses, manage budgets, and make informed financial decisions with our comprehensive expense tracking solution.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Everything you need to manage your finances
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Smart Expense Dashboard"
              description="Track your expenses with our intuitive dashboard. Add, edit, and categorize expenses easily. View spending patterns with interactive charts and get detailed breakdowns of your financial activity."
              icon={<DollarSign className="h-4 w-4 text-primary" />}
            />
            <FeatureCard
              title="Flexible Budget Management"
              description="Create multiple budget types including monthly, vacation, home, and project budgets. Set category-specific limits, track progress with visual indicators, and manage your spending goals effectively."
              icon={<PiggyBank className="h-4 w-4 text-primary" />}
            />
            <FeatureCard
              title="Currency Converter"
              description="Convert between different currencies in real-time. View historical exchange rates with interactive charts and make informed decisions about international transactions."
              icon={<LineChart className="h-4 w-4 text-primary" />}
            />
          </div>
        </div>
      </section>
    </div>
  )
} 