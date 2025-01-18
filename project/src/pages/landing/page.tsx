import { ArrowRight, PiggyBank, LineChart, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  delay?: number
}

function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}




export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
          <div className="absolute inset-0 bg-grid-white/10" style={{ 
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem"
          }} />
        </motion.div>

        <div className="container max-w-[64rem] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Master Your Money with{" "}
            <span className="text-primary">FinanceFlow</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-muted-foreground max-w-[42rem] mx-auto leading-relaxed"
          >
            Your all-in-one solution for expense tracking, budgeting, and financial goal setting. Take control of your finances and build a secure financial future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-[58rem] mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our comprehensive suite of tools helps you track expenses, set budgets, and achieve your financial goals with ease.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Smart Expense Dashboard"
              description="Track your expenses with our intuitive dashboard. Add, edit, and categorize expenses easily. View spending patterns with interactive charts and get detailed breakdowns of your financial activity."
              icon={<DollarSign className="h-5 w-5 text-primary" />}
              delay={0}
            />
            <FeatureCard
              title="Flexible Budget Management"
              description="Create multiple budget types including monthly, vacation, home, and project budgets. Set category-specific limits, track progress with visual indicators, and manage your spending goals effectively."
              icon={<PiggyBank className="h-5 w-5 text-primary" />}
              delay={0.1}
            />
            <FeatureCard
              title="Currency Converter"
              description="Convert between different currencies in real-time. View historical exchange rates with interactive charts and make informed decisions about international transactions."
              icon={<LineChart className="h-5 w-5 text-primary" />}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-primary px-6 py-16 sm:py-24 sm:px-12"
          >
            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Start your financial journey today
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
                Join thousands of users who are already taking control of their finances with FinanceFlow.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-background px-8 py-3 text-sm font-medium text-primary shadow-sm hover:bg-accent transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 