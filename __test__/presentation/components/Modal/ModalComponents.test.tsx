import React from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import OtpModal from "@/presentation/components/Modal/OtpModal/OtpModal"
import AddressModal from "@/presentation/components/Modal/AddressModal/AddressModal"
import IconButton from "@/presentation/components/IconButton"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => ({
    modalProps: [] as Array<Record<string, unknown>>,
    otpFormProps: [] as Array<Record<string, unknown>>,
    addressFormProps: [] as Array<Record<string, unknown>>,
    confirmationModalProps: [] as Array<Record<string, unknown>>,
    successModalProps: [] as Array<Record<string, unknown>>,
    capturedUseOtpConfig: null as Record<string, any> | null,
    withOtp: vi.fn(),
    refetchAddresses: vi.fn(),
    containerGet: vi.fn(),
    validateOtpUpdateInformation: vi.fn(),
    updateMember: vi.fn(),
    addMemberAddress: vi.fn(),
    updateMemberAddress: vi.fn(),
}))

vi.mock("@/presentation/components/Modal", () => ({
    __esModule: true,
    default: ({
        children,
        isOpen,
        onClose,
        headerButton,
    }: {
        children: React.ReactNode
        isOpen: boolean
        onClose?: (isOpen: boolean) => void
        headerButton?: React.ReactNode
    }) => {
        mocks.modalProps.push({ isOpen, onClose, headerButton })
        return isOpen ? (
            <div data-testid="modal">
                <div data-testid="modal-header">{headerButton}</div>
                <button type="button" onClick={() => onClose?.(false)}>
                    dismiss-modal
                </button>
                {children}
            </div>
        ) : null
    },
}))

vi.mock("@/presentation/components/IconButton/IconButton.module.css", () => ({
    __esModule: true,
    default: {
        iconButton: "icon-button",
    },
}))

vi.mock("@/presentation/components/Layout/OtpForm", () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => {
        mocks.otpFormProps.push(props)
        return (
            <div data-testid="otp-form">
                {String((props.title as string | undefined) ?? "")}
                {String((props.otp as { mfaToken?: string } | undefined)?.mfaToken ?? "")}
            </div>
        )
    },
}))

vi.mock("@/presentation/forms/AddressForm/AddressFormContainer", () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => {
        mocks.addressFormProps.push(props)
        return (
            <div data-testid="address-form">
                <button
                    type="button"
                    onClick={() =>
                        (props.onSubmit as (values: Record<string, unknown>, country: string) => void)?.(
                            {
                                id: "address-id",
                                alias: "Casa",
                                street1: "Av. Principal",
                                street2: "Depto 1",
                                state: { name: "Pichincha" },
                                city: { name: "Quito" },
                                zone: { name: "Norte" },
                            },
                            "EC",
                        )
                    }
                >
                    submit-address
                </button>
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Modal/ConfirmationModal", () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => {
        mocks.confirmationModalProps.push(props)
        return (
            <div data-testid="confirmation-modal">
                <span>{String(props.isOpen)}</span>
                <button type="button" onClick={() => (props.onConfirm as () => void)?.()}>
                    confirm-exit
                </button>
                <button type="button" onClick={() => (props.onCancel as () => void)?.()}>
                    cancel-exit
                </button>
            </div>
        )
    },
}))

vi.mock("@/presentation/components/Modal/SuccessAlertModal", () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => {
        mocks.successModalProps.push(props)
        return (
            <div data-testid="success-modal">
                <span>{String(props.isOpen)}</span>
                <span>{String(props.title ?? "")}</span>
                <span>{String(props.description ?? "")}</span>
                <button type="button" onClick={() => (props.onContinue as () => void)?.()}>
                    continue-success
                </button>
            </div>
        )
    },
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    __esModule: true,
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/hooks/useAddress", () => ({
    __esModule: true,
    default: () => ({
        refetchAddresses: mocks.refetchAddresses,
    }),
}))

vi.mock("@/presentation/hooks/useOtp", () => ({
    __esModule: true,
    default: (config: Record<string, unknown>) => {
        mocks.capturedUseOtpConfig = config
        return {
            withOtp: mocks.withOtp,
        }
    },
}))

describe("Modal components", () => {
    beforeEach(() => {
        mocks.modalProps.length = 0
        mocks.otpFormProps.length = 0
        mocks.addressFormProps.length = 0
        mocks.confirmationModalProps.length = 0
        mocks.successModalProps.length = 0
        mocks.capturedUseOtpConfig = null
        mocks.withOtp.mockReset()
        mocks.refetchAddresses.mockReset()
        mocks.containerGet.mockReset()
        mocks.validateOtpUpdateInformation.mockReset()
        mocks.updateMember.mockReset()
        mocks.addMemberAddress.mockReset()
        mocks.updateMemberAddress.mockReset()

        mocks.containerGet.mockImplementation((type: string) => {
            if (type === UseCaseTypes.UpdateMemberUseCase) {
                return {
                    validateOtpUpdateInformation: mocks.validateOtpUpdateInformation,
                    updateMember: mocks.updateMember,
                }
            }

            if (type === UseCaseTypes.AddMemberAddressUseCase) {
                return {
                    addMemberAddress: mocks.addMemberAddress,
                }
            }

            if (type === UseCaseTypes.UpdateMemberAddressUseCase) {
                return {
                    updateMemberAddress: mocks.updateMemberAddress,
                }
            }

            return {}
        })
    })

    it("renders IconButton and forwards props", () => {
        const onClick = vi.fn()

        render(
            <IconButton className="extra-class" onClick={onClick} type="button">
                icon-content
            </IconButton>,
        )

        const button = screen.getByRole("button")
        expect(button).toHaveTextContent("icon-content")
        expect(button.className).toContain("extra-class")

        fireEvent.click(button)

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("renders OtpModal with default title and closes through the modal callback", () => {
        const onClose = vi.fn()
        const onModalClose = vi.fn()

        render(
            <OtpModal
                isActive
                modalId="otp-modal"
                onClose={onClose}
                onModalClose={onModalClose}
                otp={{ mfaToken: "token-1", durationOtpCodeMinutes: 5, email: null, cellPhone: null }}
                onSubmitOtp={vi.fn()}
                onResendOtp={vi.fn()}
            />,
        )

        expect(screen.getByTestId("modal-header")).toBeEmptyDOMElement()
        expect(screen.getByTestId("otp-form")).toHaveTextContent("Código de seguridad")
        expect(screen.getByTestId("otp-form")).toHaveTextContent("token-1")

        fireEvent.click(screen.getByRole("button", { name: "dismiss-modal" }))

        expect(onModalClose).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("submits the address form through withOtp and handles unsaved-exit confirmation", async () => {
        const onClose = vi.fn()
        mocks.withOtp.mockResolvedValue(undefined)

        render(
            <AddressModal
                isActive
                modalId="address-modal"
                onClose={onClose}
                address={{ alias: "", street1: "", street2: "", country: "EC" } as any}
                title="Agregar dirección"
                submitText="Guardar"
            />,
        )

        expect(screen.getByTestId("modal-header")).toHaveTextContent("Agregar dirección")
        fireEvent.click(screen.getByRole("button", { name: "submit-address" }))

        await waitFor(() => {
            expect(mocks.withOtp).toHaveBeenCalledWith({
                values: expect.objectContaining({
                    id: "address-id",
                    alias: "Casa",
                }),
                country: "EC",
            })
        })

        fireEvent.click(screen.getByRole("button", { name: "dismiss-modal" }))
        expect(screen.getByTestId("confirmation-modal")).toHaveTextContent("true")

        fireEvent.click(screen.getByRole("button", { name: "cancel-exit" }))
        expect(screen.getByTestId("confirmation-modal")).toHaveTextContent("false")

        fireEvent.click(screen.getByRole("button", { name: "dismiss-modal" }))
        fireEvent.click(screen.getByRole("button", { name: "confirm-exit" }))

        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })

    it("requests otp, validates it and completes the validated flow without saving again", async () => {
        render(
            <AddressModal
                isActive
                modalId="address-modal"
                onClose={vi.fn()}
                address={{ alias: "", street1: "", street2: "", country: "EC" } as any}
                title="Editar dirección"
                submitText="Guardar"
            />,
        )

        const otpConfig = mocks.capturedUseOtpConfig as Record<string, (...args: any[]) => Promise<void>>
        const submitParams = {
            values: {
                id: "address-id",
                alias: "Casa",
                street1: "Av. Principal",
                street2: "Depto 1",
                state: { name: "Pichincha" },
                city: { name: "Quito" },
                zone: { name: "Norte" },
            },
            country: "EC",
        }

        await act(async () => {
            await otpConfig.onRequestOtp()
        })

        expect(mocks.updateMember).toHaveBeenCalledWith({ isAddress: true })

        await act(async () => {
            await otpConfig.onSubmitOtp(
                { mfaCode: "123456", mfaToken: "mfa-token" },
                submitParams,
            )
        })

        expect(mocks.validateOtpUpdateInformation).toHaveBeenCalledWith({
            address: expect.objectContaining({
                country: "EC",
                alias: "Casa",
                city: { name: "Quito" },
            }),
            mfaCode: "123456",
            mfaToken: "mfa-token",
        })

        await act(async () => {
            await otpConfig.onContinue(submitParams)
        })

        expect(mocks.addMemberAddress).not.toHaveBeenCalled()
        expect(mocks.updateMemberAddress).not.toHaveBeenCalled()
        expect(mocks.refetchAddresses).toHaveBeenCalledTimes(1)
        expect(screen.getByTestId("success-modal")).toHaveTextContent(
            "Dirección actualizada correctamente",
        )
    })

    it("saves a new address when otp validation is not required to continue", async () => {
        render(
            <AddressModal
                isActive
                modalId="address-modal"
                onClose={vi.fn()}
                address={{ alias: "", street1: "", street2: "", country: "EC" } as any}
                title="Agregar dirección"
                submitText="Guardar"
            />,
        )

        const otpConfig = mocks.capturedUseOtpConfig as Record<string, (...args: any[]) => Promise<void>>
        const submitParams = {
            values: {
                alias: "Trabajo",
                street1: "Calle 1",
                street2: "Oficina",
                state: { name: "Guayas" },
                city: { name: "Guayaquil" },
                zone: { name: "Centro" },
            },
            country: "EC",
        }

        await act(async () => {
            await otpConfig.onContinue(submitParams)
        })

        expect(mocks.addMemberAddress).toHaveBeenCalledWith(
            expect.objectContaining({
                alias: "Trabajo",
                country: "EC",
            }),
        )
        expect(screen.getByTestId("success-modal")).toHaveTextContent(
            "Dirección creada correctamente",
        )
    })

    it("updates an existing address in the save flow and closes from success", async () => {
        const onClose = vi.fn()

        render(
            <AddressModal
                isActive
                modalId="address-modal"
                onClose={onClose}
                address={{ alias: "", street1: "", street2: "", country: "EC" } as any}
                title="Editar dirección"
                submitText="Guardar"
            />,
        )

        const otpConfig = mocks.capturedUseOtpConfig as Record<string, (...args: any[]) => Promise<void>>
        const submitParams = {
            values: {
                id: "address-id",
                alias: "Casa",
                street1: "Av. Principal",
                street2: "Depto 1",
                state: { name: "Pichincha" },
                city: { name: "Quito" },
                zone: { name: "Norte" },
            },
            country: "EC",
        }

        await act(async () => {
            await otpConfig.onContinue(submitParams)
        })

        expect(mocks.updateMemberAddress).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "address-id",
                alias: "Casa",
            }),
        )

        fireEvent.click(screen.getByRole("button", { name: "continue-success" }))

        await waitFor(() => {
            expect(onClose).toHaveBeenCalledTimes(1)
        })
    })
})
