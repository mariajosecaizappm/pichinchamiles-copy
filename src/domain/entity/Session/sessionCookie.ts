export const SESSION_COOKIE_NAME = 'session_id'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 año
const COOKIE_PATH = '/'
const COOKIE_SAME_SITE: 'Lax' | 'Strict' | 'None' = 'Lax'

type AlsLike = {
    getStore(): Map<string, string> | undefined
    run<R>(store: Map<string, string>, fn: () => R): R
}

declare global {
    var __ppmSessionAls: AlsLike | undefined
}

class ScopedStore implements AlsLike {
    private currentStore: Map<string, string> | undefined

    getStore(): Map<string, string> | undefined {
        return this.currentStore
    }

    run<R>(store: Map<string, string>, fn: () => R): R {
        const prev = this.currentStore
        this.currentStore = store
        let isPromise = false
        try {
            const result = fn()
            if (result && typeof (result as unknown as Promise<unknown>).then === 'function') {
                isPromise = true
                return ((result as unknown as Promise<unknown>).finally(() => {
                    this.currentStore = prev
                })) as unknown as R
            }
            return result
        } finally {
            if (!isPromise) {
                this.currentStore = prev
            }
        }
    }
}

let alsInstance: AlsLike | undefined

function getAsyncLocalStorage(): AlsLike | undefined {
    if (alsInstance) return alsInstance
    if (typeof globalThis.__ppmSessionAls !== 'undefined') return globalThis.__ppmSessionAls

    const GlobalAls = (globalThis as unknown as { AsyncLocalStorage?: new () => AlsLike }).AsyncLocalStorage
    if (GlobalAls) {
        try {
            alsInstance = new GlobalAls()
            globalThis.__ppmSessionAls = alsInstance
            return alsInstance
        } catch {
            // fallback
        }
    }

    alsInstance = new ScopedStore()
    globalThis.__ppmSessionAls = alsInstance
    return alsInstance
}

export function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function generateSessionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
        return globalThis.crypto.randomUUID()
    }
    // Fallback: RFC4122 v4 UUID format
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export function getSessionCookieFromBrowser(): string | null {
    if (!isBrowser()) return null
    const cookies = document.cookie.split(';')
    for (const raw of cookies) {
        const trimmed = raw.trim()
        if (trimmed.startsWith(`${SESSION_COOKIE_NAME}=`)) {
            const value = trimmed.slice(SESSION_COOKIE_NAME.length + 1)
            return decodeURIComponent(value)
        }
    }
    return null
}

export function setSessionCookieInBrowser(value: string): void {
    if (!isBrowser()) return
    const encoded = encodeURIComponent(value)
    const attrs = [
        `path=${COOKIE_PATH}`,
        `SameSite=${COOKIE_SAME_SITE}`,
        `max-age=${COOKIE_MAX_AGE}`,
    ]
    document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; ${attrs.join('; ')}`
}

export function getOrCreateSessionCookieInBrowser(): string {
    const existing = getSessionCookieFromBrowser()
    if (existing) return existing
    const fresh = generateSessionId()
    setSessionCookieInBrowser(fresh)
    return fresh
}

export function runWithSessionId<T>(sid: string, fn: () => T): T {
    const als = getAsyncLocalStorage()
    if (!als) return fn()
    const store = new Map<string, string>()
    store.set(SESSION_COOKIE_NAME, sid)
    return als.run(store, fn)
}

export function getSessionIdFromServerStore(): string | null {
    const als = getAsyncLocalStorage()
    if (!als) return null
    const store = als.getStore()
    return store?.get(SESSION_COOKIE_NAME) ?? null
}

async function getSessionCookieFromNextCookies(): Promise<string | null> {
    if (isBrowser()) return null
    try {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const value = cookieStore.get(SESSION_COOKIE_NAME)?.value
        return value ?? null
    } catch {
        return null
    }
}

export async function getCurrentSessionId(): Promise<string> {
    const fromStore = getSessionIdFromServerStore()
    if (fromStore) return fromStore

    if (isBrowser()) {
        return getOrCreateSessionCookieInBrowser()
    }

    const fromNext = await getSessionCookieFromNextCookies()
    if (fromNext) return fromNext

    return generateSessionId()
}
