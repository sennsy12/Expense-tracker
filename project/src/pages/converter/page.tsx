import { ConverterForm } from "../../components/converter/ConverterForm"

export default function ConverterPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Currency Converter
          </h1>
          <p className="text-muted-foreground mt-1">
            Convert between different currencies using real-time exchange rates
          </p>
        </div>

        <ConverterForm />

        {/* Exchange Rate Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Exchange rates are updated every 5 minutes</p>
          <p className="mt-1">Powered by Exchange Rate API</p>
        </div>
      </div>
    </main>
  )
} 