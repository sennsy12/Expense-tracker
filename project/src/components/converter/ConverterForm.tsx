import React, { useState, useMemo, useCallback } from "react"
import { ArrowLeftRight, RefreshCcw } from "lucide-react"
import { cn } from "../../lib/utils/utils"
import { useExchangeRate } from "../../hooks/useExchangeRate"
import { CurrencySelect } from "./CurrencySelect"
import { ExchangeRateChart } from "./ExchangeRateChart"

export function ConverterForm() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")

  const { data, isLoading, isError, refetch } = useExchangeRate(fromCurrency)

  const convertedAmount = useMemo(() => 
    data ? (amount * data.conversion_rates[toCurrency]).toFixed(2) : "0.00",
    [amount, data, toCurrency]
  )

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }, [fromCurrency, toCurrency])

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value))
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Amount
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
              className="mt-1.5 w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="Enter amount..."
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2 sm:gap-4 sm:items-end">
            <div>
              <label className="text-sm font-medium text-muted-foreground">From</label>
              <CurrencySelect 
                value={fromCurrency} 
                onChange={setFromCurrency}
                className="mt-1.5"
              />
            </div>

            <button
              onClick={swapCurrencies}
              className="h-10 w-10 sm:w-10 rounded-md border bg-background flex items-center justify-center hover:bg-accent self-end group rotate-90 sm:rotate-0"
              aria-label="Swap currencies"
            >
              <ArrowLeftRight className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            <div>
              <label className="text-sm font-medium text-muted-foreground">To</label>
              <CurrencySelect 
                value={toCurrency} 
                onChange={setToCurrency}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Result */}
          <div className="rounded-md bg-muted p-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {amount} {fromCurrency} =
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {convertedAmount} {toCurrency}
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className={cn(
              "w-full h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh Rates
            </span>
          </button>

          {/* Error State */}
          {isError && (
            <p className="text-sm text-red-500 text-center">
              Failed to fetch exchange rates. Please try again.
            </p>
          )}
        </div>
      </div>

      {/* Historical Chart */}
      <ExchangeRateChart 
        fromCurrency={fromCurrency} 
        toCurrency={toCurrency}
        amount={amount}
      />
    </div>
  )
} 