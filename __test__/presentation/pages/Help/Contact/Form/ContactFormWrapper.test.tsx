import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"
import type {Member} from "@/domain/entity/Member/member"

const mocks = vi.hoisted(() => ({
    useSession: vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

import ContactFormWrapper from "@/presentation/pages/Help/Contact/Form/ContactFormWrapper"

describe("ContactFormWrapper", () => {
    it("should render children when member exists", () => {
        mocks.useSession.mockReturnValue({
            member: {identificationNumber: "12345"} as unknown as Member,
        })

        render(
            <ContactFormWrapper>
                {(member) => <div data-testid="child">{member.identificationNumber}</div>}
            </ContactFormWrapper>,
        )

        expect(screen.getByTestId("child")).toHaveTextContent("12345")
    })

    it("should render nothing when member is null", () => {
        mocks.useSession.mockReturnValue({
            member: null,
        })

        const {container} = render(
            <ContactFormWrapper>
                {() => <div data-testid="child">Child</div>}
            </ContactFormWrapper>,
        )

        expect(container.firstChild).toBeNull()
    })
})
