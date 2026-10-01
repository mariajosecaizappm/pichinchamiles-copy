/** Groups digits from the right using the given separator (e.g. `1000000` → `1.000.000`). */
export const groupDigits = (digits: string, separator: string): string => {
    if (!digits) return "0"

    const groups: string[] = []
    for (let end = digits.length; end > 0; end -= 3) {
        groups.unshift(digits.slice(Math.max(0, end - 3), end))
    }

    return groups.join(separator)
}

/**
 * Formats miles for display: thousands with `.`, millions+ with `'`.
 * Examples: `18.000`, `1'200.000`, `1'000'000.000`
 */
export const formatMiles = (value: number | string): string => {
    if (value === null || value === undefined || value === "") return "0"

    const raw = typeof value === "string" ? value.trim() : String(value)
    const sanitized = raw.replace(/[^\d-]/g, "")
    const numericValue = Number(sanitized)

    if (!Number.isFinite(numericValue) || numericValue === 0) return "0"

    const isNegative = numericValue < 0
    const digits = String(Math.floor(Math.abs(numericValue)))

    let formatted: string
    if (digits.length <= 6) {
        formatted = groupDigits(digits, ".")
    } else {
        const millionsPart = digits.slice(0, -6)
        const thousandsPart = digits.slice(-6)
        formatted = `${groupDigits(millionsPart, "'")}'${groupDigits(thousandsPart, ".")}`
    }

    return isNegative ? `-${formatted}` : formatted
}

const formatCurrencyAmount = (value: number): string => {
    if (!Number.isFinite(value)) return "0,00"

    const isNegative = value < 0
    const [integerPart, fractionPart] = Math.abs(value).toFixed(2).split(".")

    const formatted = `${groupDigits(integerPart, ".")},${fractionPart}`

    return isNegative ? `-${formatted}` : formatted
}

export const formatPriceQuantities = (value: number): string => {
    return formatCurrencyAmount(value)
}

export const formatCopaymentAmount = (value: number): string => {
    return formatCurrencyAmount(value)
}
