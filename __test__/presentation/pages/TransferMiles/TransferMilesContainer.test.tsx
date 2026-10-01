import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ApiError } from "@/domain/entity/Error/models/ApiError"
import { ErrorCode } from "@/domain/entity/Error/structure/error"
import { MemberType, PersonalMember } from "@/domain/entity/Member/member"
import { TransferStatus } from "@/domain/entity/Transfer/structure/transfer"
import { EventName } from "@/presentation/analytics/types"

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    push: vi.fn(),
    execute: vi.fn(),
    createTransfer: vi.fn(),
    getTransferOtp: vi.fn(),
    useSession: vi.fn(),
    withOtp: vi.fn(),
    track: vi.fn(),
    mountTrackerProps: null as Record<string, unknown> | null,
    onContinue: null as ((params: unknown) => Promise<void> | void) | null,
    onSubmitOtp: null as ((mfa: unknown, params: unknown) => Promise<void>) | null,
    onRequestOtp: null as ((params: unknown) => Promise<unknown>) | null,
    transferMilesProps: null as Record<string, unknown> | null,
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
}))

vi.mock("@/presentation/config/inversify.config", async () => {
    const UseCaseTypes = (await import("@/domain/entity/Types/UseCaseTypes")).default
    return {
        default: {
            get: (type: symbol) => {
                if (type === UseCaseTypes.CreateTransferUseCase) {
                    return { execute: mocks.createTransfer }
                }
                if (type === UseCaseTypes.GetGenerateOtpTransferUseCase) {
                    return { execute: mocks.getTransferOtp }
                }
                return { execute: mocks.execute }
            },
        },
    }
})

vi.mock("@/presentation/hooks/useSession", () => ({
    default: mocks.useSession,
}))

vi.mock("@/presentation/hooks/useKount", () => ({
    default: () => ({ sessionId: "kount-session" }),
}))

vi.mock("@/presentation/hooks/useOtp", () => ({
    default: ({
        onContinue,
        onSubmitOtp,
        onRequestOtp,
    }: {
        onContinue: (params: unknown) => Promise<void> | void
        onSubmitOtp: (mfa: unknown, params: unknown) => Promise<void>
        onRequestOtp: (params: unknown) => Promise<unknown>
    }) => {
        mocks.onContinue = onContinue
        mocks.onSubmitOtp = onSubmitOtp
        mocks.onRequestOtp = onRequestOtp
        return {
            withOtp: mocks.withOtp,
            isOtpModalOpen: false,
            openOtpModal: vi.fn(),
            closeOtpModal: vi.fn(),
            pendingSubmitParams: null,
        }
    },
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({ track: mocks.track }),
}))

vi.mock("@/presentation/analytics/MountTracker", () => ({
    MountTracker: (props: Record<string, unknown>) => {
        mocks.mountTrackerProps = props
        return null
    },
}))

vi.mock("@/presentation/pages/TransferMiles/TransferMilesSkeleton", () => ({
    default: () => <div data-testid="transfer-miles-skeleton" />,
}))

vi.mock("@/presentation/pages/TransferMiles/TransferMiles", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.transferMilesProps = props
        return <div data-testid="transfer-miles-page" />
    },
}))

vi.mock("@/presentation/pages/TransferMiles/components/BalanceZeroModal", () => ({
    default: ({
        isOpen,
        title,
        description,
        continueLabel,
        onGoHome,
    }: {
        isOpen: boolean
        title: string
        description: string
        continueLabel: string
        onGoHome: () => void
    }) =>
        isOpen ? (
            <div data-testid="balance-zero-modal">
                <h2>{title}</h2>
                <p>{description}</p>
                <button type="button" onClick={onGoHome}>
                    {continueLabel}
                </button>
            </div>
        ) : null,
}))

vi.mock("@/presentation/pages/TransferMiles/components/ConfirmTransferModal", () => ({
    default: ({
        isOpen,
        miles,
        beneficiaryName,
        onConfirm,
        onCancel,
    }: {
        isOpen: boolean
        miles: number
        beneficiaryName: string
        onConfirm: () => void
        onCancel: () => void
    }) =>
        isOpen ? (
            <div data-testid="confirm-transfer-modal">
                <p>
                    {miles} {beneficiaryName}
                </p>
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="button" onClick={onConfirm}>
                    Confirmar
                </button>
            </div>
        ) : null,
}))

vi.mock("@/presentation/pages/TransferMiles/components/TransferSuccessModal", () => ({
    default: ({
        isOpen,
        onViewBalance,
        onGoHome,
        onClose,
    }: {
        isOpen: boolean
        onViewBalance: () => void
        onGoHome: () => void
        onClose: () => void
    }) =>
        isOpen ? (
            <div data-testid="transfer-success-modal">
                <button type="button" onClick={onClose} aria-label="Cerrar modal">
                    Cerrar
                </button>
                <button type="button" onClick={onGoHome}>
                    Volver al home
                </button>
                <button type="button" onClick={onViewBalance}>
                    Ver mi saldo
                </button>
            </div>
        ) : null,
}))

import TransferMilesContainer from "@/presentation/pages/TransferMiles/TransferMilesContainer"

const member: PersonalMember = {
    memberType: MemberType.PERSONAL,
    firstName: "Valentina",
    secondName: "",
    firstLastName: "Bustamante",
    secondLastName: "",
    acceptLopd: true,
    acceptedTermsAndCondition: true,
    cellPhone: "",
    enrollmentEmail: "",
    gender: "",
    birthDay: "",
    state: "",
    city: "",
    address: "",
    identificationNumber: "1111111111",
    identificationType: "CI",
    phone: "",
    country: "",
    registrationDate: "",
    segment: "",
}

describe("TransferMilesContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.transferMilesProps = null
        mocks.mountTrackerProps = null
        mocks.onContinue = null
        mocks.onSubmitOtp = null
        mocks.onRequestOtp = null
        mocks.createTransfer.mockResolvedValue({ balanceAfterOperation: 232490 })
        mocks.getTransferOtp.mockResolvedValue({
            cellPhone: "099",
            email: null,
            durationOtpCodeMinutes: 5,
            mfaToken: "mfa-token",
        })
        mocks.useSession.mockReturnValue({
            member,
            balance: 250490,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance: vi.fn(),
        })
    })

    it("renders transfer page for authenticated users and tracks VIEWED_TRANSFER", () => {
        render(<TransferMilesContainer />)

        expect(screen.getByTestId("transfer-miles-page")).toBeInTheDocument()
        expect(screen.queryByTestId("balance-zero-modal")).not.toBeInTheDocument()
        expect(mocks.transferMilesProps).toMatchObject({
            member,
            balance: 250490,
            beneficiary: null,
            beneficiaryNotFound: false,
            identificationFieldError: null,
        })
        expect(mocks.mountTrackerProps).toEqual({ name: EventName.VIEWED_TRANSFER })
    })

    it("sets inline field error for self transfer", async () => {
        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({
            identificationNumber: member.identificationNumber,
        })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.identificationFieldError).toBe(
                "No puedes transferir millas a tu propia cuenta. Ingresa el documento de otro socio."
            )
        })
    })

    it("shows blocking balance zero modal and keeps transfer page in background", () => {
        mocks.useSession.mockReturnValue({
            member,
            balance: 9,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance: vi.fn(),
        })

        render(<TransferMilesContainer />)

        expect(screen.getByTestId("transfer-miles-page")).toBeInTheDocument()
        expect(screen.getByTestId("balance-zero-modal")).toBeInTheDocument()
        expect(
            screen.getByRole("heading", { name: "Necesitas más millas para transferir" })
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                "Para realizar una transferencia necesitas tener al menos 10 millas en tu cuenta."
            )
        ).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Ir al home" }))

        expect(mocks.push).toHaveBeenCalledWith("/utilice-sus-millas/productos")
    })

    it("does not show balance modal when balance is at least 10", () => {
        mocks.useSession.mockReturnValue({
            member,
            balance: 10,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance: vi.fn(),
        })

        render(<TransferMilesContainer />)

        expect(screen.getByTestId("transfer-miles-page")).toBeInTheDocument()
        expect(screen.queryByTestId("balance-zero-modal")).not.toBeInTheDocument()
    })

    it("validates beneficiary successfully", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.execute).toHaveBeenCalledWith("1723456789")
            expect(mocks.transferMilesProps?.beneficiary).toEqual(
                expect.objectContaining({ identificationNumber: "1723456789" })
            )
        })
    })

    it("marks beneficiary as not found when repository returns canceled status", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: TransferStatus.CANCELED,
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(true)
            expect(mocks.transferMilesProps?.identificationFieldError).toBe(
                "Este usuario no está registrado en Pichincha Miles."
            )
        })
    })

    it("marks beneficiary as not found when repository returns canceled without access", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: TransferStatus.CANCELED_WITHOUT_ACCESS,
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(true)
        })
    })

    it("marks beneficiary as not found when repository returns empty id", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(true)
        })
    })

    it("marks beneficiary as not found when api throws BENEFICIARY_NOT_FOUND", async () => {
        mocks.execute.mockRejectedValueOnce(new ApiError(ErrorCode.BENEFICIARY_NOT_FOUND))

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(true)
            expect(mocks.transferMilesProps?.identificationFieldError).toBe(
                "Este usuario no está registrado en Pichincha Miles."
            )
        })
    })

    it("clears beneficiary when document changes after validation", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })

        mocks.transferMilesProps?.onDocumentChange("1723456780")

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).toBeNull()
        })
    })

    it("clears not found flag when document changes", async () => {
        mocks.execute.mockRejectedValueOnce(new ApiError(ErrorCode.BENEFICIARY_NOT_FOUND))

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(true)
        })

        mocks.transferMilesProps?.onDocumentChange("12345678")

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiaryNotFound).toBe(false)
            expect(mocks.transferMilesProps?.identificationFieldError).toBeNull()
        })
    })

    it("closes confirm modal on confirm and keeps transfer data for OTP flow", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })

        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })

        mocks.transferMilesProps?.onMilesChange("18000")
        mocks.transferMilesProps?.onTransfer("18000")

        await waitFor(() => {
            expect(screen.getByTestId("confirm-transfer-modal")).toBeInTheDocument()
            expect(mocks.track).toHaveBeenCalledWith(EventName.TRANSFER)
        })

        fireEvent.click(screen.getByRole("button", { name: "Confirmar" }))

        await waitFor(() => {
            expect(screen.queryByTestId("confirm-transfer-modal")).not.toBeInTheDocument()
            expect(mocks.transferMilesProps?.miles).toBe("18000")
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
            expect(mocks.withOtp).toHaveBeenCalledWith({
                beneficiary: expect.objectContaining({ identificationNumber: "1723456789" }),
                miles: 18000,
            })
        })
    })

    it("keeps form data when confirm modal is cancelled", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })
        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })

        mocks.transferMilesProps?.onMilesChange("18000")
        mocks.transferMilesProps?.onTransfer("18000")

        await waitFor(() => {
            expect(screen.getByTestId("confirm-transfer-modal")).toBeInTheDocument()
            expect(mocks.track).toHaveBeenCalledWith(EventName.TRANSFER)
        })

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))

        await waitFor(() => {
            expect(screen.queryByTestId("confirm-transfer-modal")).not.toBeInTheDocument()
            expect(mocks.transferMilesProps?.miles).toBe("18000")
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })
    })

    it("creates transfer with OTP, updates balance and opens success modal", async () => {
        const updateBalance = vi.fn()
        mocks.useSession.mockReturnValue({
            member,
            balance: 250490,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance,
        })
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })
        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })

        mocks.transferMilesProps?.onMilesChange("18000")
        mocks.transferMilesProps?.onTransfer("18000")
        await waitFor(() => {
            expect(screen.getByTestId("confirm-transfer-modal")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByRole("button", { name: "Confirmar" }))

        const pendingTransfer = {
            beneficiary: expect.objectContaining({ id: "beneficiary-1" }),
            miles: 18000,
        }

        await waitFor(() => {
            expect(mocks.withOtp).toHaveBeenCalledWith(pendingTransfer)
        })

        await mocks.onSubmitOtp?.(
            { mfaCode: "123456", mfaToken: "mfa-token" },
            {
                beneficiary: {
                    id: "beneficiary-1",
                    status: "active",
                    firstName: "Guadalupe",
                    secondName: "",
                    firstLastName: "Bedoya",
                    secondLastName: "",
                    identificationNumber: "1723456789",
                },
                miles: 18000,
            }
        )

        expect(mocks.createTransfer).toHaveBeenCalledWith(
            {
                originCurrencyId: "cur-1",
                destinationCurrencyId: "cur-1",
                destinationMemberUserId: "beneficiary-1",
                pointsAmount: 18000,
                mfaCode: "123456",
                mfaToken: "mfa-token",
            },
            "kount-session"
        )
        expect(updateBalance).toHaveBeenCalledWith(232490)
        expect(mocks.track).toHaveBeenCalledWith(EventName.VIEWED_TRANSFER_STATUS, { status: "success", amount: 18000 })

        await mocks.onContinue?.({
            beneficiary: {
                id: "beneficiary-1",
                status: "active",
                firstName: "Guadalupe",
                secondName: "",
                firstLastName: "Bedoya",
                secondLastName: "",
                identificationNumber: "1723456789",
            },
            miles: 18000,
        })

        await waitFor(() => {
            expect(screen.getByTestId("transfer-success-modal")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole("button", { name: "Ver mi saldo" }))
        expect(mocks.push).toHaveBeenCalledWith("/mi-perfil/transacciones")

        await mocks.onContinue?.({
            beneficiary: {
                id: "beneficiary-1",
                status: "active",
                firstName: "Guadalupe",
                secondName: "",
                firstLastName: "Bedoya",
                secondLastName: "",
                identificationNumber: "1723456789",
            },
            miles: 18000,
        })
        await waitFor(() => {
            expect(screen.getByTestId("transfer-success-modal")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole("button", { name: "Volver al home" }))
        expect(mocks.push).toHaveBeenCalledWith("/utilice-sus-millas/productos")
    })

    it("creates transfer without OTP when continue runs before submit", async () => {
        const updateBalance = vi.fn()
        mocks.useSession.mockReturnValue({
            member,
            balance: 250490,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance,
        })

        render(<TransferMilesContainer />)

        await mocks.onContinue?.({
            beneficiary: {
                id: "beneficiary-1",
                status: "active",
                firstName: "Guadalupe",
                secondName: "",
                firstLastName: "Bedoya",
                secondLastName: "",
                identificationNumber: "1723456789",
            },
            miles: 18000,
        })

        expect(mocks.createTransfer).toHaveBeenCalledWith(
            {
                originCurrencyId: "cur-1",
                destinationCurrencyId: "cur-1",
                destinationMemberUserId: "beneficiary-1",
                pointsAmount: 18000,
                mfaCode: undefined,
                mfaToken: undefined,
            },
            "kount-session"
        )
        expect(updateBalance).toHaveBeenCalledWith(232490)
        expect(mocks.track).toHaveBeenCalledWith(EventName.VIEWED_TRANSFER_STATUS, { status: "success", amount: 18000 })

        await waitFor(() => {
            expect(screen.getByTestId("transfer-success-modal")).toBeInTheDocument()
        })
    })

    it("tracks VIEWED_TRANSFER_STATUS with error when transfer fails", async () => {
        const updateBalance = vi.fn()
        mocks.useSession.mockReturnValue({
            member,
            balance: 250490,
            isLogged: true,
            isValidatingSession: false,
            programCurrency: { pointsCurrencyId: "cur-1", coinsCurrencyId: "coin-1" },
            updateBalance,
        })
        mocks.createTransfer.mockRejectedValueOnce(new Error("Transfer failed"))

        render(<TransferMilesContainer />)

        await expect(mocks.onSubmitOtp?.(
            { mfaCode: "123456", mfaToken: "mfa-token" },
            {
                beneficiary: {
                    id: "beneficiary-1",
                    status: "active",
                    firstName: "Guadalupe",
                    secondName: "",
                    firstLastName: "Bedoya",
                    secondLastName: "",
                    identificationNumber: "1723456789",
                },
                miles: 20000,
            }
        )).rejects.toThrow()

        expect(mocks.track).toHaveBeenCalledWith(EventName.VIEWED_TRANSFER_STATUS, { status: "error", amount: 20000 })
    })

    it("does NOT track TRANSFER event when beneficiary is null", async () => {
        render(<TransferMilesContainer />)

        mocks.transferMilesProps?.onMilesChange("18000")
        mocks.transferMilesProps?.onTransfer("18000")

        await waitFor(() => {
            expect(mocks.track).not.toHaveBeenCalledWith(EventName.TRANSFER)
        })
    })

    it("does NOT track TRANSFER event when miles amount is invalid", async () => {
        mocks.execute.mockResolvedValueOnce({
            id: "beneficiary-1",
            status: "active",
            firstName: "Guadalupe",
            secondName: "",
            firstLastName: "Bedoya",
            secondLastName: "",
            identificationNumber: "1723456789",
        })

        render(<TransferMilesContainer />)

        await mocks.transferMilesProps?.onValidate({ identificationNumber: "1723456789" })
        await waitFor(() => {
            expect(mocks.transferMilesProps?.beneficiary).not.toBeNull()
        })

        mocks.transferMilesProps?.onTransfer("9999999")

        await waitFor(() => {
            expect(mocks.track).not.toHaveBeenCalledWith(EventName.TRANSFER)
        })
    })
})

