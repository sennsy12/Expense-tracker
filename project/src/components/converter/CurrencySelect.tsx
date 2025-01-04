import React, { useMemo } from "react"
import { currencies } from "../../lib/data/currencies"
import { orderedRegions } from "../../lib/types/currency"
import { cn } from "../../lib/utils/utils"

export interface CurrencySelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const CurrencySelect = React.memo(function CurrencySelect({ 
  value, 
  onChange, 
  className 
}: CurrencySelectProps) {
  const groupedCurrencies = useMemo(() => 
    currencies.reduce<Record<string, typeof currencies>>((acc, currency) => {
      const region = currency.region || "Other"
      if (!acc[region]) {
        acc[region] = []
      }
      acc[region].push(currency)
      return acc
    }, {}),
    [] // Dependencies array is empty since currencies are static
  )

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full h-10 rounded-md border-0 bg-muted px-3 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
        className
      )}
    >
      {orderedRegions.map(
        (region) =>
          groupedCurrencies[region] && (
            <optgroup key={region} label={region}>
              {groupedCurrencies[region].map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </optgroup>
          )
      )}
    </select>
  )
}) 