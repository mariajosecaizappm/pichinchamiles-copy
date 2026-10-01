import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import Providers from "@/presentation/components/providers/Providers"
import MainLayout from "@/presentation/components/Layout/MainLayout"
import ScrollToTopOnRouteChange from "@/presentation/components/ScrollToTopOnRouteChange"
import Script from "next/script"
import pageMetadata from "@/presentation/config/metadata"

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
})

const prelo = localFont({
    src: [
        { path: "../../public/fonts/prelo/Prelo-ExtraLight.otf", weight: "100", style: "normal" },
        { path: "../../public/fonts/prelo/Prelo-Book.otf", weight: "400", style: "normal" },
        { path: "../../public/fonts/prelo/Prelo-Medium.otf", weight: "500", style: "normal" },
        { path: "../../public/fonts/prelo/Prelo-SemiBold.otf", weight: "600", style: "normal" },
        { path: "../../public/fonts/prelo/Prelo-Bold.otf", weight: "700", style: "normal" },
    ],
    variable: "--font-prelo",
    display: "swap",
})

const preloSlab = localFont({
    src: [
        { path: "../../public/fonts/prelo/PreloSlab-Book.otf", weight: "400", style: "normal" },
        { path: "../../public/fonts/prelo/PreloSlab-SemiBold.otf", weight: "600", style: "normal" },
        { path: "../../public/fonts/prelo/PreloSlab-Bold.otf", weight: "700", style: "normal" },
    ],
    variable: "--font-prelo-slab",
    display: "swap",
})

export const metadata: Metadata = {
    title: {
        default: pageMetadata.siteName,
        template: `%s | ${pageMetadata.siteName}`,
    },
    description: pageMetadata.defaultDescription,
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
    },
}


export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://gn-resources.developppm.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://gn-resources.preprodppm.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://resources.miles.com.ec" crossOrigin="anonymous" />
                <link rel="preload" as="image" href="/pm-logo.svg" type="image/svg+xml" />
                <link rel="preconnect" href="https://consent.cookiebot.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
            </head>
            <body className={`${inter.variable} ${prelo.variable} ${preloSlab.variable} antialiased`}>
                <Providers>
                    <ScrollToTopOnRouteChange />
                    <MainLayout>
                        {children}
                    </MainLayout>
                </Providers>
                {/* Cookiebot must stay afterInteractive / synchronous unless the account uses manual blocking; async or lazyOnload would break auto cookie-blocking. */}
                {process.env.NEXT_PUBLIC_COOKIEBOT_ID ? (
                    <Script
                        id="Cookiebot"
                        src="https://consent.cookiebot.com/uc.js"
                        data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_ID}
                        strategy="afterInteractive"
                    />
                ) : null}
                <Script src="https://checkout.placetopay.com/lightbox.min.js" strategy="afterInteractive"/>
            </body>
        </html>
    )
}
