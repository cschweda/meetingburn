/**
 * Real-time currency conversion using Frankfurter API (free, no API key).
 * Rates updated daily ~16:00 CET. api.frankfurter.dev
 */

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'CAD' | 'AUD' | 'JPY'

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CHF: 'Swiss Franc',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
}

const FRANKFURTER_BASE = 'https://api.frankfurter.dev/v1'
const CACHE_MINUTES = 60

interface FrankfurterResponse {
  base: string
  date: string
  rates: Record<string, number>
}

let cachedRates: Record<string, number> | null = null
let cachedRatesDate: string | null = null
let cacheTimestamp = 0

function isCacheValid(): boolean {
  return cachedRates !== null && Date.now() - cacheTimestamp < CACHE_MINUTES * 60 * 1000
}

/** Format API date (YYYY-MM-DD) for display (e.g. "February 9, 2026"). */
function formatRatesDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function useCurrencyConversion() {
  const rates = ref<Record<string, number> | null>(null)
  const ratesDate = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const targetCurrencies: CurrencyCode[] = ['EUR', 'GBP', 'CHF', 'CAD', 'AUD', 'JPY']

  async function fetchRates(): Promise<Record<string, number> | null> {
    if (isCacheValid()) {
      ratesDate.value = cachedRatesDate
      return cachedRates
    }

    loading.value = true
    error.value = null

    try {
      const symbols = targetCurrencies.join(',')
      const res = await fetch(`${FRANKFURTER_BASE}/latest?base=USD&symbols=${symbols}`)

      if (!res.ok) {
        throw new Error(`Failed to fetch rates: ${res.status}`)
      }

      const data = (await res.json()) as FrankfurterResponse
      const ratesMap = data.rates ?? {}

      // Include USD as 1 for consistency
      cachedRates = { USD: 1, ...ratesMap }
      cachedRatesDate = data.date ?? null
      cacheTimestamp = Date.now()
      rates.value = cachedRates
      ratesDate.value = cachedRatesDate
      return cachedRates
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Currency fetch failed'
      error.value = msg
      rates.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  function convert(amountUsd: number, toCurrency: CurrencyCode): number {
    const r = rates.value ?? cachedRates
    if (!r || !(toCurrency in r)) return amountUsd
    return amountUsd * (r[toCurrency] as number)
  }

  function formatInCurrency(amountUsd: number, currencyCode: CurrencyCode): string {
    const amount = currencyCode === 'USD' ? amountUsd : convert(amountUsd, currencyCode)
    const locale = currencyCode === 'USD' ? 'en-US' : currencyCode === 'GBP' ? 'en-GB' : 'de-DE'
    const isWhole = currencyCode === 'JPY'
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: isWhole ? 0 : 2,
    }
    return new Intl.NumberFormat(locale, options).format(amount)
  }

  return {
    rates,
    ratesDate,
    loading,
    error,
    targetCurrencies,
    fetchRates,
    convert,
    formatInCurrency,
    formatRatesDate,
  }
}
