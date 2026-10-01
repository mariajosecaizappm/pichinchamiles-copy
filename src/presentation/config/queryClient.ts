import { QueryClient } from "@tanstack/react-query"

const STALE_TIME = 600000
const LOCAL_CACHE_TIME = 720000

const layoutQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            gcTime: LOCAL_CACHE_TIME,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
        },
        mutations: {
            retry: 0,
        },
    },
})

export default layoutQueryClient

export const getLayoutQueryClient = () => {
    return layoutQueryClient
}
