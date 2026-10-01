import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        css: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "clover", "html"],
            reportsDirectory: "./coverage",
            include: ["src/**"],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
})
