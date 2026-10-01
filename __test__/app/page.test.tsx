import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("next/image", () => ({
    getImageProps: (options: any) => ({
        props: { src: options.src, srcSet: options.src, alt: options.alt || "", width: options.width, height: options.height }
    }),
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: Record<string, unknown>) => <img {...props} />,
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
    useSelector: () => mockSelector,
}))

vi.mock("@heroui/react", () => ({
    extendVariants: () => {
        const MockButton = ({children, ...rest}: Record<string, unknown>) => (
            <button {...rest}>{children as React.ReactNode}</button>
        )
        return MockButton
    },
    Button: ({children, ...rest}: Record<string, unknown>) => (
        <button {...rest}>{children as React.ReactNode}</button>
    ),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
}))

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/components/HomeBannerCarouselPreloader", () => ({
    default: () => <div data-testid="banner-slider">BannerSlider</div>,
}))

vi.mock("@/presentation/pages/Home/components/HowPMEWorks", () => ({
    default: () => <div data-testid="how-pme-works">HowPMEWorks</div>,
}))

vi.mock("@/presentation/pages/Home/components/ExchangeSteps", () => ({
    default: () => <div data-testid="exchange-steps">ExchangeSteps</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeFaqs", () => ({
    default: () => <div data-testid="home-faqs">HomeFaqs</div>,
}))

vi.mock("@/presentation/pages/Home/components/Footer/Footer", () => ({
    default: () => <div data-testid="footer">Footer</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories", () => ({
    default: () => <div data-testid="home-redemption-categories">HomeRedemptionCategories</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards", () => ({
    default: () => <div data-testid="home-featured-rewards">HomeFeaturedRewards</div>,
}))

import Index from "@/app/page"

describe("page", () => {

    it("should render the BannerSlider inside Home", () => {
        render(<Index />)
        expect(screen.getByTestId("banner-slider")).toBeInTheDocument()
    })
})
