"use client"

import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { Provider } from "react-redux"

import { QueryClientProvider } from "@tanstack/react-query"
import { store } from "../../config/store"
import layoutQueryClient from "../../config/queryClient"
import { ScreenReaderProvider } from "./ScreenReaderProvider"
import { useRouter } from "next/navigation"
import { ModalProvider } from "@/presentation/components/Modal"

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}


const Providers = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    return (
        <>
            <ToastProvider placement={"top-right"} toastOffset={60} />
            <QueryClientProvider client={layoutQueryClient}>
                <HeroUIProvider navigate={router.push} locale="es">
                    <Provider store={store}>
                        <ScreenReaderProvider>
                            <ModalProvider>
                                {children}
                            </ModalProvider>
                        </ScreenReaderProvider>
                    </Provider>
                </HeroUIProvider>
            </QueryClientProvider>
        </>
    )
}

export default Providers
