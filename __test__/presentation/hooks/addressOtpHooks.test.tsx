import React from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import useAddress from "@/presentation/hooks/useAddress"
import useOtp from "@/presentation/hooks/useOtp"
import AddressModal from "@/presentation/components/Modal/AddressModal/AddressModal"
import LimitAdressesModal from "@/presentation/pages/Profile/Addresses/LimitAdressesModal"
import OtpModal from "@/presentation/components/Modal/OtpModal/OtpModal"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
    closeAllModals: vi.fn(),
    containerGet: vi.fn(),
    getMemberAddresses: vi.fn(),
    useQuery: vi.fn(),
    refetch: vi.fn(),
    addressToFormValues: vi.fn(),
    modalState: {
        isOpen: false,
        activeModalId: null as string | null,
        hasOpenModal: vi.fn(() => false),
    },
}))

vi.mock("@/presentation/components/Modal", () => ({
    __esModule: true,
    useModal: (modalId?: string) => ({
        isOpen: modalId ? mocks.modalState.isOpen : false,
        activeModalId: mocks.modalState.activeModalId,
        openModal: mocks.openModal,
        closeModal: mocks.closeModal,
        closeAllModals: mocks.closeAllModals,
        hasOpenModal: mocks.modalState.hasOpenModal,
    }),
}))

vi.mock("@tanstack/react-query", () => ({
    __esModule: true,
    useQuery: mocks.useQuery,
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    __esModule: true,
    default: {
        get: mocks.containerGet,
    },
}))

vi.mock("@/presentation/forms/AddressForm/formatData", () => ({
    __esModule: true,
    addressToFormValues: mocks.addressToFormValues,
}))

describe("useAddress and useOtp", () => {
    beforeEach(() => {
        mocks.openModal.mockReset()
        mocks.closeModal.mockReset()
        mocks.closeAllModals.mockReset()
        mocks.containerGet.mockReset()
        mocks.getMemberAddresses.mockReset()
        mocks.useQuery.mockReset()
        mocks.refetch.mockReset()
        mocks.addressToFormValues.mockReset()
        mocks.refetch.mockResolvedValue(undefined)
        mocks.modalState.isOpen = false
        mocks.modalState.activeModalId = null
        mocks.modalState.hasOpenModal.mockReset()
        mocks.modalState.hasOpenModal.mockReturnValue(false)

        mocks.containerGet.mockImplementation((type: string) => {
            if (type === UseCaseTypes.GetMemberAddressesUseCase) {
                return {
                    getMemberAddresses: mocks.getMemberAddresses,
                }
            }

            return {}
        })
    })

    it("loads addresses and exposes modal actions from useAddress", () => {
        const address = { id: "1", alias: "Casa" }
        mocks.useQuery.mockImplementation((config: Record<string, unknown>) => {
            expect(config).toMatchObject({
                queryKey: ["address"],
                refetchOnWindowFocus: false,
                enabled: true,
            })
            return {
                data: [address],
                isLoading: true,
                refetch: mocks.refetch,
            }
        })
        mocks.addressToFormValues.mockReturnValue({ id: "1", alias: "Casa transformada" })

        const { result } = renderHook(() => useAddress({ fetchOnMount: true }))

        expect(result.current.isLoadingAddresses).toBe(true)
        expect(result.current.addresses).toEqual([address])

        act(() => {
            result.current.onAddAddress()
        })

        expect(mocks.openModal).toHaveBeenCalledWith(
            AddressModal,
            expect.objectContaining({
                title: "Agregar dirección",
                submitText: "Agregar dirección",
            }),
        )

        act(() => {
            result.current.onEditAddress(address as any)
        })

        expect(mocks.addressToFormValues).toHaveBeenCalledWith(address)
        expect(mocks.openModal).toHaveBeenLastCalledWith(
            AddressModal,
            expect.objectContaining({
                address: { id: "1", alias: "Casa transformada" },
                title: "Editar dirección de envío",
                submitText: "Guardar dirección",
            }),
        )

        act(() => {
            result.current.closeAddressModal()
            result.current.refetchAddresses()
        })

        expect(mocks.closeModal).toHaveBeenCalledTimes(1)
        expect(mocks.refetch).toHaveBeenCalledTimes(1)
    })

    it("should disable query when fetchOnMount is false", () => {
        mocks.useQuery.mockImplementation((config: Record<string, unknown>) => {
            expect(config).toMatchObject({
                queryKey: ["address"],
                refetchOnWindowFocus: false,
                enabled: false,
            })
            return {
                data: undefined,
                isLoading: false,
                refetch: mocks.refetch,
            }
        })

        const { result } = renderHook(() => useAddress({ fetchOnMount: false }))

        expect(result.current.isLoadingAddresses).toBe(false)
        expect(result.current.addresses).toEqual([])
    })

    it("should disable query by default when no config is provided", () => {
        mocks.useQuery.mockImplementation((config: Record<string, unknown>) => {
            expect(config).toMatchObject({
                enabled: false,
            })
            return {
                data: undefined,
                isLoading: false,
                refetch: mocks.refetch,
            }
        })

        const { result } = renderHook(() => useAddress())

        expect(result.current.isLoadingAddresses).toBe(false)
        expect(result.current.addresses).toEqual([])
    })

    it("should open LimitAdressesModal when onAddAddress is called with 10 or more addresses", () => {
        const addresses = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1), alias: `Casa ${i + 1}` }))
        mocks.useQuery.mockReturnValue({
            data: addresses,
            isLoading: false,
            refetch: mocks.refetch,
        })

        const { result } = renderHook(() => useAddress({ fetchOnMount: true }))

        act(() => {
            result.current.onAddAddress()
        })

        expect(mocks.openModal).toHaveBeenCalledWith(LimitAdressesModal)
    })

    it("should return empty array when query data is undefined", () => {
        mocks.useQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            refetch: mocks.refetch,
        })

        const { result } = renderHook(() => useAddress({ fetchOnMount: true }))

        expect(result.current.addresses).toEqual([])
    })

    it("continues directly in useOtp when no otp is returned", async () => {
        const onRequestOtp = vi.fn().mockResolvedValue(null)
        const onContinue = vi.fn().mockResolvedValue(undefined)
        const onSubmitOtp = vi.fn().mockResolvedValue(undefined)
        const onSubmitOtpSuccess = vi.fn().mockResolvedValue(undefined)

        const { result } = renderHook(() =>
            useOtp({
                title: "OTP",
                onRequestOtp,
                onContinue,
                onSubmitOtp,
                onSubmitOtpSuccess,
            }),
        )

        let hasOtp = false
        await act(async () => {
            hasOtp = await result.current.withOtp({ orderId: "A1" })
        })

        expect(hasOtp).toBe(false)
        expect(onRequestOtp).toHaveBeenCalledWith({ orderId: "A1" })
        expect(onContinue).toHaveBeenCalledWith({ orderId: "A1" })
        expect(onSubmitOtpSuccess).not.toHaveBeenCalled()
        expect(result.current.pendingSubmitParams).toBeNull()
    })

    it("opens the otp modal and completes the submit flow", async () => {
        const onRequestOtp = vi.fn().mockResolvedValue({
            mfaToken: "otp-token",
            durationOtpCodeMinutes: 5,
            email: null,
            cellPhone: null,
        })
        const onContinue = vi.fn().mockResolvedValue(undefined)
        const onSubmitOtp = vi.fn().mockResolvedValue(undefined)
        const onSubmitOtpSuccess = vi.fn().mockResolvedValue(undefined)
        mocks.openModal.mockReturnValue("otpModal")
        mocks.modalState.isOpen = true
        mocks.modalState.hasOpenModal.mockReturnValue(true)

        const { result } = renderHook(() =>
            useOtp({
                title: "Código OTP",
                onRequestOtp,
                onContinue,
                onSubmitOtp,
                onSubmitOtpSuccess,
                onModalClose: vi.fn(),
                onBlockUser: vi.fn(),
                onUnblockUser: vi.fn(),
                onContinueBlockUser: vi.fn(),
            }),
        )

        await act(async () => {
            await result.current.withOtp({ orderId: "A1" })
        })

        expect(result.current.isOtpModalOpen).toBe(true)
        expect(result.current.pendingSubmitParams).toEqual({ orderId: "A1" })
        expect(mocks.openModal).toHaveBeenCalledWith(
            OtpModal,
            expect.objectContaining({
                otp: expect.objectContaining({ mfaToken: "otp-token" }),
                title: "Código OTP",
            }),
        )

        const modalProps = mocks.openModal.mock.calls[0][1] as Record<string, (...args: any[]) => Promise<void>>

        await act(async () => {
            await modalProps.onSubmitOtp?.({ mfaCode: "123456", mfaToken: "otp-token" })
        })

        expect(onSubmitOtp).toHaveBeenCalledWith(
            { mfaCode: "123456", mfaToken: "otp-token" },
            { orderId: "A1" },
        )
        expect(mocks.closeModal).toHaveBeenCalledTimes(1)
        expect(onContinue).toHaveBeenCalledWith({ orderId: "A1" })
        expect(onSubmitOtpSuccess).toHaveBeenCalledWith({ orderId: "A1" })

        await waitFor(() => {
            expect(result.current.pendingSubmitParams).toBeNull()
        })
    })

    it("resends otp and reopens the modal when a new token is returned", async () => {
        const firstOtp = {
            mfaToken: "otp-token-1",
            durationOtpCodeMinutes: 5,
            email: null,
            cellPhone: null,
        }
        const secondOtp = {
            mfaToken: "otp-token-2",
            durationOtpCodeMinutes: 5,
            email: null,
            cellPhone: null,
        }
        const onRequestOtp = vi.fn().mockResolvedValueOnce(firstOtp).mockResolvedValueOnce(secondOtp)
        mocks.openModal.mockReturnValue("otpModal")

        const { result } = renderHook(() =>
            useOtp({
                onRequestOtp,
                onContinue: vi.fn(),
                onSubmitOtp: vi.fn(),
            }),
        )

        await act(async () => {
            await result.current.withOtp({ orderId: "A2" })
        })

        const modalProps = mocks.openModal.mock.calls[0][1] as Record<string, (...args: any[]) => Promise<void>>

        await act(async () => {
            await modalProps.onResendOtp?.()
        })

        expect(onRequestOtp).toHaveBeenNthCalledWith(2, { orderId: "A2" })
        expect(mocks.openModal).toHaveBeenNthCalledWith(
            2,
            OtpModal,
            expect.objectContaining({
                otp: expect.objectContaining({ mfaToken: "otp-token-2" }),
            }),
        )
    })

    it("closes the otp modal and continues when resend no longer requires otp", async () => {
        const onRequestOtp = vi.fn()
            .mockResolvedValueOnce({
                mfaToken: "otp-token",
                durationOtpCodeMinutes: 5,
                email: null,
                cellPhone: null,
            })
            .mockResolvedValueOnce(null)
        const onContinue = vi.fn().mockResolvedValue(undefined)
        mocks.openModal.mockReturnValue("otpModal")

        const { result } = renderHook(() =>
            useOtp({
                onRequestOtp,
                onContinue,
                onSubmitOtp: vi.fn(),
            }),
        )

        await act(async () => {
            await result.current.withOtp({ orderId: "A3" })
        })

        const modalProps = mocks.openModal.mock.calls[0][1] as Record<string, (...args: any[]) => Promise<void>>

        await act(async () => {
            await modalProps.onResendOtp?.()
        })

        expect(mocks.closeModal).toHaveBeenCalledTimes(1)
        expect(onContinue).toHaveBeenCalledWith({ orderId: "A3" })

        await act(async () => {
            result.current.closeOtpModal()
        })

        expect(mocks.closeModal).toHaveBeenCalledTimes(2)
        expect(result.current.pendingSubmitParams).toBeNull()
    })
})
