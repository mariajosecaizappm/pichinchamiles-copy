import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
    compress: true,
    poweredByHeader: false,
    reactStrictMode: false,
    async headers() {
        return [
            {
                source: "/",
                headers: [
                    { key: "Cache-Control", value: "no-cache" },
                ],
            },
            {
                source: "/_next/static/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                ],
            },
        ];
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            "@heroui/react",
            "framer-motion",
            "lodash-es",
        ],
    },
    webpack: (config, { webpack, isServer }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(
                    /@react-stately\/datepicker\/dist\/intlStrings\.mjs$/,
                    path.resolve(process.cwd(), "src/config/datepicker-intl-strings.mjs")
                )
            )
        }
        return config
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        qualities: [60, 75, 90],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gn-resources.developppm.com'
            },
            {
                protocol: 'https',
                hostname: 'gn-resources.preprodppm.com'
            },
            {
                protocol: 'https',
                hostname: 'resources.miles.com.ec'
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com'
            }
        ]
    },
}

export default nextConfig

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

if (process.env.NODE_ENV === "development") {
    initOpenNextCloudflareForDev()
}

