import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

type Token = {
    accessToken: string
    refreshToken: string
    refreshTokenExpireDate: Date
}

type FakeAxiosError = {
    config: any
    response: { status: number }
}

type FakeAxiosResponse = {
    status: number
    data?: any
    config: any
}

type RequestInterceptor = {
    fulfilled: (config: any) => any | Promise<any>
    rejected?: (error: any) => any
}

type ResponseInterceptor = {
    fulfilled?: (response: any) => any | Promise<any>
    rejected?: (error: any) => any
}

function createFakeAxiosInstance() {
    const requestInterceptors: RequestInterceptor[] = []
    const responseInterceptors: ResponseInterceptor[] = []
    const routes = new Map<string, Array<{ kind: "resolve" | "reject"; value: any }>>()
    const calls: any[] = []

    const instance: any = async (config: any) => {
        let nextConfig = {
            ...config,
            headers: {...(config?.headers ?? {})},
        }

        for (const interceptor of requestInterceptors) {
            try {
                nextConfig = await interceptor.fulfilled(nextConfig)
            } catch (error) {
                if (interceptor.rejected) {
                    throw await interceptor.rejected(error)
                }
                throw error
            }
        }

        calls.push(nextConfig)

        const queue = routes.get(nextConfig.url) ?? []
        if (queue.length === 0) {
            throw new Error(`No route mock for ${String(nextConfig.url)}`)
        }
        const item = queue.shift()!
        routes.set(nextConfig.url, queue)

        if (item.kind === "resolve") {
            let response: FakeAxiosResponse = {
                status: item.value?.status ?? 200,
                data: item.value?.data,
                config: nextConfig,
            }
            for (const interceptor of responseInterceptors) {
                if (interceptor.fulfilled) {
                    response = await interceptor.fulfilled(response)
                }
            }
            return response
        }

        const error: FakeAxiosError = {
            config: nextConfig,
            response: {status: item.value?.response?.status ?? 500},
        }

        for (const interceptor of responseInterceptors) {
            if (interceptor.rejected) {
                return await interceptor.rejected(error)
            }
        }

        throw error
    }

    instance.get = (url: string, config?: any) =>
        instance({
            ...(config ?? {}),
            url,
            method: "get",
        })

    instance.post = (url: string, data?: any, config?: any) =>
        instance({
            ...(config ?? {}),
            url,
            method: "post",
            data,
        })

    instance.interceptors = {
        request: {
            use: (fulfilled: any, rejected?: any) => {
                requestInterceptors.push({fulfilled, rejected})
                return requestInterceptors.length - 1
            },
        },
        response: {
            use: (fulfilled?: any, rejected?: any) => {
                responseInterceptors.push({fulfilled, rejected})
                return responseInterceptors.length - 1
            },
        },
    }

    instance.__mock = {
        enqueueResolve: (url: string, value: any = {status: 200, data: {}}) => {
            const queue = routes.get(url) ?? []
            queue.push({kind: "resolve", value})
            routes.set(url, queue)
        },
        enqueueReject: (url: string, value: any = {response: {status: 500}}) => {
            const queue = routes.get(url) ?? []
            queue.push({kind: "reject", value})
            routes.set(url, queue)
        },
        calls,
    }

    return instance
}

const axiosCreateMock = vi.fn()
vi.mock("axios", () => ({
    default: {
        create: axiosCreateMock,
    },
}))

const tokenServiceMock = {
    getToken: vi.fn(),
    clearToken: vi.fn(),
}
vi.mock("@/domain/services/TokenService", () => ({
    default: tokenServiceMock,
}))

const getErrorMock = vi.fn()
vi.mock("@/data/provider/errorMap", () => ({
    getError: getErrorMock,
}))

const refreshMock = vi.fn()
const containerMock = {
    get: vi.fn(() => ({refresh: refreshMock})),
}
vi.mock("@/presentation/config/inversify.config", () => ({
    default: containerMock,
}))

function stubHrefSetter() {
    try {
        const spy = vi.spyOn(window.location, "href", "set")
        spy.mockImplementation(() => {
        })
        return spy
    } catch {
        const original = window.location
        const replacement = {...original, href: original.href}
        Object.defineProperty(window, "location", {value: replacement, writable: true})
        const spy = vi.spyOn(window.location, "href", "set")
        spy.mockImplementation(() => {
        })
        return spy
    }
}

describe("when interacting with axiosPrivate", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe("when sending a request", () => {
        it("and token exists, adds Authorization header", async () => {
            vi.resetModules()

            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)

            const token: Token = {
                accessToken: "ACCESS_1",
                refreshToken: "REFRESH_1",
                refreshTokenExpireDate: new Date(),
            }
            tokenServiceMock.getToken.mockResolvedValue(token)

            fakeAxios.__mock.enqueueResolve("/ok", {
                status: 200,
                data: "ok",
            })

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")
            await axPrivate.get("/ok")

            const headers = fakeAxios.__mock.calls[0]?.headers ?? {}
            expect(headers.Authorization).toBe(`Bearer ${token.accessToken}`)
        })

        it("and token is missing, does not add Authorization header", async () => {
            vi.resetModules()

            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)

            tokenServiceMock.getToken.mockResolvedValue(null)

            fakeAxios.__mock.enqueueResolve("/ok", {status: 200, data: "ok"})

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")
            await axPrivate.get("/ok")

            const headers = fakeAxios.__mock.calls[0]?.headers ?? {}
            expect(headers.Authorization).toBeUndefined()
        })
    })

    describe("when receiving a 401 response", () => {
        it("and URL is not refresh-token, refreshes token and retries original request", async () => {
            vi.resetModules()

            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)

            const oldToken: Token = {
                accessToken: "ACCESS_OLD",
                refreshToken: "REFRESH_OLD",
                refreshTokenExpireDate: new Date(),
            }
            const newToken: Token = {
                accessToken: "ACCESS_NEW",
                refreshToken: "REFRESH_NEW",
                refreshTokenExpireDate: new Date(),
            }

            let currentToken: Token | null = oldToken
            tokenServiceMock.getToken.mockImplementation(async () => currentToken)
            refreshMock.mockImplementation(async () => {
                currentToken = newToken
                return newToken
            })

            fakeAxios.__mock.enqueueReject("/protected", {response: {status: 401}})
            fakeAxios.__mock.enqueueResolve("/protected", {status: 200, data: "ok"})

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")
            const response = await axPrivate.get("/protected")

            expect(response.status).toBe(200)
            expect(refreshMock).toHaveBeenCalledTimes(1)

            const retryHeaders = fakeAxios.__mock.calls[1]?.headers ?? {}
            expect(retryHeaders.Authorization).toBe(`Bearer ${newToken.accessToken}`)
        })

        it("and multiple requests fail, performs a single refresh for concurrent 401s", async () => {
            vi.resetModules()

            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)

            const oldToken: Token = {
                accessToken: "ACCESS_OLD",
                refreshToken: "REFRESH_OLD",
                refreshTokenExpireDate: new Date(),
            }
            const newToken: Token = {
                accessToken: "ACCESS_NEW",
                refreshToken: "REFRESH_NEW",
                refreshTokenExpireDate: new Date(),
            }

            let currentToken: Token | null = oldToken
            tokenServiceMock.getToken.mockImplementation(async () => currentToken)

            let resolveRefresh: ((value: Token) => void) | undefined
            let markRefreshStarted: (() => void) | undefined
            const refreshStarted = new Promise<void>((resolve) => {
                markRefreshStarted = resolve
            })
            refreshMock.mockImplementation(
                () =>
                    new Promise<Token>((resolve) => {
                        resolveRefresh = resolve
                        markRefreshStarted?.()
                    })
            )

            fakeAxios.__mock.enqueueReject("/p1", {response: {status: 401}})
            fakeAxios.__mock.enqueueResolve("/p1", {status: 200, data: "p1"})
            fakeAxios.__mock.enqueueReject("/p2", {response: {status: 401}})
            fakeAxios.__mock.enqueueResolve("/p2", {status: 200, data: "p2"})

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")

            const p1 = axPrivate.get("/p1")
            const p2 = axPrivate.get("/p2")

            await refreshStarted
            currentToken = newToken
            resolveRefresh?.(newToken)

            const [r1, r2] = await Promise.all([p1, p2])

            expect(r1.status).toBe(200)
            expect(r2.status).toBe(200)
            expect(refreshMock).toHaveBeenCalledTimes(1)
        })

        it("and URL includes refresh-token, clears token and redirects to '/' only once", async () => {
            vi.resetModules()

            const hrefSpy = stubHrefSetter()
            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)
            
            const sessionStorageSpy = vi.spyOn(Storage.prototype, 'clear')

            const token: Token = {
                accessToken: "ACCESS",
                refreshToken: "REFRESH",
                refreshTokenExpireDate: new Date(),
            }
            tokenServiceMock.getToken.mockResolvedValue(token)
            refreshMock.mockResolvedValue(token)

            fakeAxios.__mock.enqueueReject("/refresh-token", {response: {status: 401}})
            fakeAxios.__mock.enqueueResolve("/refresh-token", {status: 200, data: "ok"})
            fakeAxios.__mock.enqueueReject("/refresh-token", {response: {status: 401}})
            fakeAxios.__mock.enqueueResolve("/refresh-token", {status: 200, data: "ok"})

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")
            await axPrivate.get("/refresh-token")
            await axPrivate.get("/refresh-token")

            expect(tokenServiceMock.clearToken).toHaveBeenCalledTimes(1)
            expect(sessionStorageSpy).toHaveBeenCalledTimes(1)
            expect(hrefSpy).toHaveBeenCalledWith("/")
            
            sessionStorageSpy.mockRestore()
        })
    })

    describe("when receiving a non-401 error response", () => {
        it("and error is mapped, rejects with mapped error", async () => {
            vi.resetModules()

            const fakeAxios = createFakeAxiosInstance()
            axiosCreateMock.mockReturnValue(fakeAxios)

            tokenServiceMock.getToken.mockResolvedValue(null)

            const mappedError = {kind: "mapped"}
            getErrorMock.mockReturnValue(mappedError)

            fakeAxios.__mock.enqueueReject("/boom", {response: {status: 500}})

            const {default: axPrivate} = await import("@/data/provider/axios/axiosPrivate")

            await expect(axPrivate.get("/boom")).rejects.toEqual(mappedError)
            expect(getErrorMock).toHaveBeenCalledTimes(1)
        })
    })
})
