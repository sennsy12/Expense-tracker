import { NetWorthInputForm } from "../../components/net-worth/NetWorthInputForm"
import { NetWorthHistory } from "../../components/net-worth/NetWorthHistory"
import { NetWorthChart } from "../../components/net-worth/NetWorthChart"

export default function NetWorthPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            Net Worth Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your assets and liabilities to monitor your financial health over time.
          </p>
        </div>
        <div className="space-y-6">
          <NetWorthInputForm />
          <NetWorthChart />
          <NetWorthHistory />
        </div>
      </div>
    </main>
  )
}