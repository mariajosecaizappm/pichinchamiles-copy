import React from "react"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {render, screen, waitFor, act, fireEvent} from "@testing-library/react"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {PaymentStatus} from "@/domain/entity/Payment/payment"
import FeePaymentStatus from "@/presentation/pages/FeePay/components/FeePaymentStatus/FeePaymentStatus"
import links from "@/presentation/config/links"

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    searchParamsGet: vi.fn(),
    searchParamsToString: vi.fn(),
    containerGet: vi.fn(),
    getFeePaymentDetail: vi.fn(),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
    useSearchParams: () => ({
        get: mocks.searchParamsGet,
        toString: mocks.searchParamsToString,
    }),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@heroui/spinner", () => ({
    Spinner: ({size, variant, "aria-label": ariaLabel, classNames}: any) => (
        <div
            data-testid="loading-spinner"
            aria-label={ariaLabel}
            role="status"
            data-size={size}
            data-variant={variant}
            data-classnames={JSON.stringify(classNames)}
        >
            spinner
        </div>
    ),
}))

vi.mock("@/presentation/pages/FeePay/components/FeePaymentStatus/FeePaymentStatusModal", () => ({
    default: ({
        isOpen,
        paymentDetail,
        onClose,
        onBackToHome,
    }: any) => (
        <div
            data-testid="fee-status-modal"
            data-is-open={String(isOpen)}
            data-reference={paymentDetail?.reference}
            data-status={paymentDetail?.status}
        >
            <button onClick={onClose} data-testid="modal-close">close</button>
            <button onClick={onBackToHome} data-testid="modal-home">home</button>
        </div>
    ),
}))

type RenderOptions = {
    reference: string
    referenceFromParams?: string | null
    paramsString?: string
}

const renderComponent = (options: RenderOptions) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    mocks.searchParamsGet.mockImplementation((key: string) => {
        if (key === "reference") return options.referenceFromParams ?? null
        return null
    })
    mocks.searchParamsToString.mockReturnValue(
        options.paramsString ?? (options.referenceFromParams ? `reference=${options.referenceFromParams}` : "")
    )

    const rerender = (newOptions: RenderOptions) => {
        mocks.searchParamsGet.mockImplementation((key: string) => {
            if (key === "reference") return newOptions.referenceFromParams ?? null
            return null
        })
        mocks.searchParamsToString.mockReturnValue(
            newOptions.paramsString ?? (newOptions.referenceFromParams ? `reference=${newOptions.referenceFromParams}` : "")
        )
        return renderResult.rerender(
            <QueryClientProvider client={queryClient}>
                <FeePaymentStatus reference={newOptions.reference} />
            </QueryClientProvider>
        )
    }

    const renderResult = render(
        <QueryClientProvider client={queryClient}>
            <FeePaymentStatus reference={options.reference} />
        </QueryClientProvider>
    )

    return { ...renderResult, rerender }
}

describe("FeePaymentStatus", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.push.mockReset()
        mocks.searchParamsGet.mockReset()
        mocks.searchParamsToString.mockReset()
        mocks.containerGet.mockReset()
        mocks.getFeePaymentDetail.mockReset()
        mocks.containerGet.mockReturnValue({
            getFeePaymentDetail: mocks.getFeePaymentDetail,
        })
        mocks.searchParamsGet.mockReturnValue(null)
        mocks.searchParamsToString.mockReturnValue("")
    })

    it("does not request payment detail when reference is empty", () => {
        renderComponent({ reference: "" })

        expect(mocks.getFeePaymentDetail).not.toHaveBeenCalled()
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument()
    })

    it("shows loading overlay while fetching fee payment detail", async () => {
        let resolvePromise: ((value: any) => void) | undefined
        mocks.getFeePaymentDetail.mockImplementation(
            () => new Promise((resolve) => {
                resolvePromise = resolve
            })
        )

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        await waitFor(() => {
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument()
        })
        expect(screen.getByLabelText("Consultando estado del fee de procesamiento")).toBeInTheDocument()

        // Cleanup pending promise
        act(() => {
            resolvePromise?.({
                reference: "FEE123",
                status: PaymentStatus.SUCCESS,
                totalAmount: 25.5,
            })
        })
    })

    it("opens modal with payment detail when query succeeds with status", async () => {
        mocks.getFeePaymentDetail.mockResolvedValue({
            reference: "FEE123",
            status: PaymentStatus.SUCCESS,
            totalAmount: 25.5,
        })

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        const modal = await screen.findByTestId("fee-status-modal")
        expect(modal.getAttribute("data-is-open")).toBe("true")
        expect(modal.getAttribute("data-reference")).toBe("FEE123")
        expect(modal.getAttribute("data-status")).toBe(PaymentStatus.SUCCESS)
    })

    it("does not open modal when status is missing (null)", async () => {
        mocks.getFeePaymentDetail.mockResolvedValue({
            reference: "FEE123",
            status: null,
            totalAmount: 0,
        })

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        await waitFor(() => {
            expect(mocks.getFeePaymentDetail).toHaveBeenCalled()
        })

        expect(screen.queryByTestId("fee-status-modal")).not.toBeInTheDocument()
    })

    it("redirects to home when query fails", async () => {
        mocks.getFeePaymentDetail.mockRejectedValue(new Error("Network error"))

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        await waitFor(() => {
            expect(mocks.push).toHaveBeenCalledWith(links.home)
        })
    })

    it("modal 'back to home' button navigates to products", async () => {
        mocks.getFeePaymentDetail.mockResolvedValue({
            reference: "FEE123",
            status: PaymentStatus.PENDING,
            totalAmount: 10.0,
        })

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        await screen.findByTestId("fee-status-modal")

        act(() => {
            fireEvent.click(screen.getByTestId("modal-home"))
        })

        await waitFor(() => {
            expect(mocks.push).toHaveBeenCalledWith(links.products)
        })
    })

    it("modal close button closes the modal without navigation", async () => {
        mocks.getFeePaymentDetail.mockResolvedValue({
            reference: "FEE123",
            status: PaymentStatus.REJECTED,
            totalAmount: 15.0,
        })

        renderComponent({ reference: "FEE123", referenceFromParams: "FEE123" })

        await screen.findByTestId("fee-status-modal")
        expect(screen.getByTestId("fee-status-modal").getAttribute("data-is-open")).toBe("true")

        act(() => {
            fireEvent.click(screen.getByTestId("modal-close"))
        })

        await waitFor(() => {
            expect(screen.getByTestId("fee-status-modal").getAttribute("data-is-open")).toBe("false")
        })
        expect(mocks.push).not.toHaveBeenCalled()
    })

    it("prioritizes reference from searchParams over the prop", async () => {
        mocks.getFeePaymentDetail.mockResolvedValue({
            reference: "FROM_PARAMS",
            status: PaymentStatus.SUCCESS,
            totalAmount: 25.5,
        })

        renderComponent({
            reference: "FROM_PROP",
            referenceFromParams: "FROM_PARAMS",
        })

        await waitFor(() => {
            expect(mocks.getFeePaymentDetail).toHaveBeenCalledWith("FROM_PARAMS")
        })

        const modal = await screen.findByTestId("fee-status-modal")
        expect(modal.getAttribute("data-reference")).toBe("FROM_PARAMS")
    })

    it("re-fetches payment status when searchParams change (after router.push)", async () => {
        const firstResponse = {
            reference: "FEE123",
            status: PaymentStatus.PENDING,
            totalAmount: 15.0,
        }
        const secondResponse = {
            reference: "FEE123",
            status: PaymentStatus.SUCCESS,
            totalAmount: 15.0,
        }
        mocks.getFeePaymentDetail
            .mockResolvedValueOnce(firstResponse)
            .mockResolvedValueOnce(secondResponse)

        const { rerender } = renderComponent({
            reference: "FEE123",
            referenceFromParams: "FEE123",
            paramsString: "expirationDateTime=2026-12-31&q=abc&reference=FEE123",
        })

        await waitFor(() => {
            expect(mocks.getFeePaymentDetail).toHaveBeenCalledTimes(1)
        })
        expect(mocks.getFeePaymentDetail).toHaveBeenNthCalledWith(1, "FEE123")

        const firstModal = await screen.findByTestId("fee-status-modal")
        expect(firstModal.getAttribute("data-status")).toBe(PaymentStatus.PENDING)

        rerender({
            reference: "FEE123",
            referenceFromParams: "FEE123",
            paramsString: "reference=FEE123",
        })

        await waitFor(() => {
            expect(mocks.getFeePaymentDetail).toHaveBeenCalledTimes(2)
        })
        expect(mocks.getFeePaymentDetail).toHaveBeenNthCalledWith(2, "FEE123")

        const secondModal = await screen.findByTestId("fee-status-modal")
        await waitFor(() => {
            expect(secondModal.getAttribute("data-status")).toBe(PaymentStatus.SUCCESS)
        })
    })
})
