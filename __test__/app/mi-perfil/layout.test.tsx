import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import Layout from "@/app/mi-perfil/layout"

const mockPush = vi.fn()
const mockUseSession = vi.fn()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Profile/components/ProfileTabs/ProfileTabs", () => ({
    default: () => <div data-testid="profile-tabs">ProfileTabs</div>,
}))

vi.mock("@/presentation/pages/Profile/components/MemberInformation/MemberInformationSkeleton", () => ({
    default: () => <div data-testid="member-info-skeleton">MemberInformationSkeleton</div>,
}))

const renderLayout = (children: React.ReactNode) => {
    return render(
        <Layout>
            {children}
        </Layout>
    )
}

describe("Profile Layout (src/app/mi-perfil/layout.tsx)", () => {
    it("should render without errors", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        const { container } = renderLayout(<div>Test Child</div>)
        expect(container).toBeInTheDocument()
    })

    it("should render ProfileTabs component", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        renderLayout(<div>Test Child</div>)

        expect(screen.getByTestId("profile-tabs")).toBeInTheDocument()
    })

    it("should render children prop correctly", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        renderLayout(<div data-testid="test-child">Test Child Content</div>)

        expect(screen.getByTestId("test-child")).toBeInTheDocument()
        expect(screen.getByText("Test Child Content")).toBeInTheDocument()
    })

    it("should have correct container structure with flex flex-col classes", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        const { container } = renderLayout(<div>Test Child</div>)

        expect(container.querySelector("div.flex.flex-col")).toBeInTheDocument()
    })

    it("should render ProfileTabs before children in DOM order", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        const { container } = renderLayout(<div data-testid="test-child">Test Child</div>)

        const wrapper = container.querySelector("div.flex.flex-col")
        const children = wrapper?.children

        expect(children).toBeDefined()
        expect(children?.[0]).toHaveAttribute("data-testid", "profile-tabs")
        expect(children?.[1]).toHaveAttribute("data-testid", "test-child")
    })

    it("should render multiple children correctly", () => {
        mockUseSession.mockReturnValue({
            member: { id: "123", name: "Test User" },
            isValidatingSession: false,
        })
        renderLayout(
            <>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </>
        )

        expect(screen.getByTestId("child-1")).toBeInTheDocument()
        expect(screen.getByTestId("child-2")).toBeInTheDocument()
    })

    it("should render the skeleton while the session is being validated", () => {
        mockUseSession.mockReturnValue({
            member: null,
            isValidatingSession: true,
        })
        renderLayout(<div data-testid="test-child">Test Child</div>)

        expect(screen.getByTestId("member-info-skeleton")).toBeInTheDocument()
        expect(screen.queryByTestId("test-child")).not.toBeInTheDocument()
    })

    it("should redirect to home when there is no member", () => {
        mockUseSession.mockReturnValue({
            member: null,
            isValidatingSession: false,
        })
        const { container } = renderLayout(<div>Test Child</div>)

        expect(container.firstChild).toBeNull()
        expect(mockPush).toHaveBeenCalledWith("/")
    })
})
