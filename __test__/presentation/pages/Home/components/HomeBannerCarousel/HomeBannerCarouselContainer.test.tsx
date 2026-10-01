import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {Banner} from "@/domain/entity/Banner/banner"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"

const mockGetBanners = vi.fn()

vi.mock("next/cache", () => ({
    unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: () => ({
            getBanners: mockGetBanners,
        }),
    },
}))

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("react-responsive-carousel", () => ({
    Carousel: ({children}: {children: React.ReactNode}) => (
        <div data-testid="carousel">{children}</div>
    ),
}))

vi.mock("next/image", () => ({
    getImageProps: (options: { src: string; alt?: string; width: number; height: number }) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("next/link", () => ({
    default: ({children, href}: {children: React.ReactNode; href: string}) => (
        <a href={href}>{children}</a>
    ),
}))

const mockDispatch = vi.fn()
const mockSelector = vi.fn()
vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: () => mockSelector(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        isLogged: false,
        information: null,
        balance: null,
        isValidatingSession: false,
        basket: null,
    }),
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
    extendVariants: () => {
        const MockButton = ({children, ...rest}: Record<string, unknown>) => (
            <button {...rest}>{children as React.ReactNode}</button>
        )
        return MockButton
    },
    Button: ({children, ...rest}: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
    Skeleton: ({children, className}: {children: React.ReactNode; className?: string}) => (
        <div data-testid="skeleton" className={className}>{children}</div>
    ),
}))

import HomeBannerCarouselContainer from "@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselContainer"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        campaignId: "campaign-1",
        title: "Test Banner",
        subtitle: "Subtitle",
        description: "Desc",
        summary: "Summary",
        link: "/link",
        linkText: "Click",
        textColor: "#FFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
        priority: 1,
        image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
    },
]

describe("HomeBannerCarouselContainer", () => {
    it("should render banners when getBanners succeeds", async () => {
        mockGetBanners.mockResolvedValue({data: mockBanners})
        const Component = await HomeBannerCarouselContainer()
        render(Component)
        expect(screen.getByText("Test Banner")).toBeInTheDocument()
    })

    it("should render skeleton when getBanners throws", async () => {
        mockGetBanners.mockRejectedValue(new Error("Network error"))
        const Component = await HomeBannerCarouselContainer()
        const { container } = render(Component)
        expect(container.querySelector(".w-full.h-\\[600px\\]")).toBeInTheDocument()
    })
})
