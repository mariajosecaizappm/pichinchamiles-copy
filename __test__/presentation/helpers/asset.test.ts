import { getPrimaryAsset } from "@/presentation/helpers/asset"
import type { ProductAsset } from "@/domain/entity/Product/product"
import { describe, expect, it } from "vitest"

const buildAsset = (overrides: Partial<ProductAsset> = {}): ProductAsset => ({
    id: overrides.id ?? "asset-id",
    type: overrides.type ?? "image",
    order: overrides.order ?? 1,
    desktopUrl: overrides.desktopUrl ?? "https://cdn.test/desktop.jpg",
    mobileUrl: overrides.mobileUrl ?? "https://cdn.test/mobile.jpg",
    htmlAlternative: overrides.htmlAlternative,
})

describe("presentation/helpers/asset", () => {
    describe("getPrimaryAsset", () => {
        it("returns the asset with the lowest order, regardless of array position", () => {
            const assets: ProductAsset[] = [
                buildAsset({ id: "detail-shot", order: 3 }),
                buildAsset({ id: "main-image", order: 1 }),
                buildAsset({ id: "lifestyle-shot", order: 2 }),
            ]

            expect(getPrimaryAsset(assets)?.id).toBe("main-image")
        })

        it("finds the true minimum even when order does not start at 1 (ECOV3SM-3796 regression)", () => {
            // Regression: order doesn't start at 1 (e.g. after deleting images). The old
            // `.find(a => a.order === 1)` fix failed here and fell back to assets[0].
            const assets: ProductAsset[] = [
                buildAsset({ id: "uploaded-last", order: 5 }),
                buildAsset({ id: "uploaded-first-but-should-be-primary", order: 4 }),
            ]

            expect(getPrimaryAsset(assets)?.id).toBe("uploaded-first-but-should-be-primary")
        })

        it("ignores duplicate order values without crashing and still returns one of the tied assets", () => {
            const assets: ProductAsset[] = [
                buildAsset({ id: "tied-a", order: 1 }),
                buildAsset({ id: "tied-b", order: 1 }),
            ]

            expect(["tied-a", "tied-b"]).toContain(getPrimaryAsset(assets)?.id)
        })

        it("excludes video assets even when a video has the lowest order", () => {
            const assets: ProductAsset[] = [
                buildAsset({ id: "video-asset", type: "video", order: 1 }),
                buildAsset({ id: "image-asset", type: "image", order: 2 }),
            ]

            expect(getPrimaryAsset(assets)?.id).toBe("image-asset")
        })

        it("returns the only image when the product has a single asset", () => {
            const assets: ProductAsset[] = [buildAsset({ id: "only-one", order: 1 })]

            expect(getPrimaryAsset(assets)?.id).toBe("only-one")
        })

        it("returns undefined when there are no valid image assets", () => {
            expect(getPrimaryAsset([])).toBeUndefined()
            expect(getPrimaryAsset([buildAsset({ type: "video" })])).toBeUndefined()
        })
    })
})
