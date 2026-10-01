// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { Suspense } from "react";
import type { JSX } from "react";
import HomeBannerCarouselPreloader from "./HomeBannerCarouselPreloader";

const preloadHeroImageMock = vi.hoisted(() => vi.fn());
const getMainBannerMock = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({
    unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({ getMainBanner: getMainBannerMock }),
    },
}));

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselContainer", () => ({
    default: () => <div data-testid="carousel-container" />,
    preloadHeroImage: preloadHeroImageMock,
}));

vi.mock("./HomeBanner", () => ({
    default: ({ banner }: { banner: { id: string } }) => <div data-testid="home-banner">{banner.id}</div>,
}));

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton", () => ({
    default: () => <div data-testid="carousel-skeleton" />,
}));

describe("HomeBannerCarouselPreloader", () => {
    it("preloads the hero image and renders the first banner as the Suspense fallback", async () => {
        const banner = {
            id: "banner-1",
            title: "Main banner",
            image: {
                desktopUrl: "https://example.com/desktop.jpg",
                mobileUrl: "https://example.com/mobile.jpg",
            },
        };

        getMainBannerMock.mockResolvedValue(banner);
        preloadHeroImageMock.mockClear();

        const result = (await HomeBannerCarouselPreloader()) as JSX.Element;

        expect(preloadHeroImageMock).toHaveBeenCalledTimes(1);
        expect(preloadHeroImageMock).toHaveBeenCalledWith(banner);
        expect(result.type).toBe(Suspense);
        expect(result.props.fallback.type(result.props.fallback.props).props["data-testid"]).toBe("home-banner");
        expect(result.props.children.type(result.props.children.props).props["data-testid"]).toBe("carousel-container");
    });

    it("renders the skeleton fallback when no banner exists", async () => {
        getMainBannerMock.mockResolvedValue(null);
        preloadHeroImageMock.mockClear();

        const result = (await HomeBannerCarouselPreloader()) as JSX.Element;

        expect(preloadHeroImageMock).not.toHaveBeenCalled();
        expect(result.type).toBe(Suspense);
        expect(result.props.fallback.type(result.props.fallback.props).props["data-testid"]).toBe("carousel-skeleton");
    });

    it("renders the skeleton fallback and does not throw when the fetch fails", async () => {
        getMainBannerMock.mockRejectedValue(new Error("network error"));
        preloadHeroImageMock.mockClear();

        const result = (await HomeBannerCarouselPreloader()) as JSX.Element;

        expect(preloadHeroImageMock).not.toHaveBeenCalled();
        expect(result.type).toBe(Suspense);
        expect(result.props.fallback.type(result.props.fallback.props).props["data-testid"]).toBe("carousel-skeleton");
    });
});
