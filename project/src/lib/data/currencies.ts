import { Currency } from "../types/currency"

export const currencies: Currency[] = [
  // Major Global Currencies
  { code: "USD", name: "US Dollar", region: "Major" },
  { code: "EUR", name: "Euro", region: "Major" },
  { code: "JPY", name: "Japanese Yen", region: "Major" },
  { code: "GBP", name: "British Pound", region: "Major" },
  { code: "CHF", name: "Swiss Franc", region: "Major" },
  { code: "AUD", name: "Australian Dollar", region: "Major" },
  { code: "CAD", name: "Canadian Dollar", region: "Major" },
  
  // Asian Currencies
  { code: "CNY", name: "Chinese Yuan", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", region: "Asia" },
  { code: "SGD", name: "Singapore Dollar", region: "Asia" },
  { code: "INR", name: "Indian Rupee", region: "Asia" },
  { code: "KRW", name: "South Korean Won", region: "Asia" },
  { code: "TWD", name: "Taiwan Dollar", region: "Asia" },
  { code: "THB", name: "Thai Baht", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", region: "Asia" },
  
  // European Currencies
  { code: "SEK", name: "Swedish Krona", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", region: "Europe" },
  { code: "DKK", name: "Danish Krone", region: "Europe" },
  { code: "PLN", name: "Polish Złoty", region: "Europe" },
  { code: "CZK", name: "Czech Koruna", region: "Europe" },
  { code: "HUF", name: "Hungarian Forint", region: "Europe" },
  
  // Americas
  { code: "MXN", name: "Mexican Peso", region: "Americas" },
  { code: "BRL", name: "Brazilian Real", region: "Americas" },
  { code: "ARS", name: "Argentine Peso", region: "Americas" },
  
  // Middle East & Africa
  { code: "AED", name: "UAE Dirham", region: "Middle East" },
  { code: "SAR", name: "Saudi Riyal", region: "Middle East" },
  { code: "ZAR", name: "South African Rand", region: "Africa" },
  { code: "TRY", name: "Turkish Lira", region: "Middle East" },
  
  // Oceania
  { code: "NZD", name: "New Zealand Dollar", region: "Oceania" },
] 