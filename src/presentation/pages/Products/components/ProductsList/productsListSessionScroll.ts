const STORAGE_PREFIX = "pm:productsList:lastProduct:"

const sessionKey = (): string => {
    if (globalThis.window === undefined) {
        return `${STORAGE_PREFIX}`
    }
    return `${STORAGE_PREFIX}${globalThis.window.location.pathname}${globalThis.window.location.search}`
}

export const rememberProductsListLastProduct = (productId: string): void => {
    try {
        globalThis.sessionStorage?.setItem(sessionKey(), productId)
    } catch {
    }
}

export const takeProductsListLastProductId = (): string | null => {
    if (globalThis.window === undefined) {
        return null
    }
    const key = sessionKey()
    try {
        const id = globalThis.sessionStorage?.getItem(key) ?? null
        if (id) {
            globalThis.sessionStorage?.removeItem(key)
        }
        return id
    } catch {
        return null
    }
}
