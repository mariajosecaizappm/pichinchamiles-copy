import React, { useContext } from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import ModalProvider, {
    ModalContext,
    ModalInjectedProps,
} from "@/presentation/components/Modal/ModalProvider"
import useModal from "@/presentation/components/Modal/useModal"

const DummyModal = ({
    label,
    modalId,
    isActive,
    onClose,
}: {
    label: string
} & ModalInjectedProps) => (
    <div data-testid={label}>
        <span>{modalId}</span>
        <span>{String(isActive)}</span>
        <button type="button" onClick={onClose}>
            close-{label}
        </button>
    </div>
)

const ContextConsumer = () => {
    const {
        isOpen,
        activeModalId,
        openModal,
        closeModal,
        closeAllModals,
        hasOpenModal,
    } = useContext(ModalContext)

    return (
        <div>
            <div data-testid="provider-open">{String(isOpen)}</div>
            <div data-testid="provider-active-id">{activeModalId ?? "none"}</div>
            <div data-testid="provider-has-a">{String(hasOpenModal("modal-a"))}</div>
            <button
                type="button"
                onClick={() => openModal(DummyModal, { label: "modal-a" }, "modal-a")}
            >
                open-a
            </button>
            <button
                type="button"
                onClick={() => openModal(DummyModal, { label: "modal-b" }, "modal-b")}
            >
                open-b
            </button>
            <button
                type="button"
                onClick={() => openModal(DummyModal, { label: "modal-a-updated" }, "modal-a")}
            >
                reopen-a
            </button>
            <button type="button" onClick={() => closeModal()}>
                close-last
            </button>
            <button type="button" onClick={() => closeModal("modal-a")}>
                close-a
            </button>
            <button type="button" onClick={closeAllModals}>
                close-all
            </button>
        </div>
    )
}

const ScopedConsumer = () => {
    const {
        isOpen,
        activeModalId,
        openModal,
        closeModal,
        closeAllModals,
    } = useModal("scoped-modal")

    return (
        <div>
            <div data-testid="scoped-open">{String(isOpen)}</div>
            <div data-testid="scoped-active-id">{activeModalId ?? "none"}</div>
            <button
                type="button"
                onClick={() => openModal(DummyModal, { label: "scoped-content" })}
            >
                scoped-open
            </button>
            <button type="button" onClick={() => closeModal()}>
                scoped-close
            </button>
            <button type="button" onClick={closeAllModals}>
                scoped-close-all
            </button>
        </div>
    )
}

describe("ModalProvider and useModal", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="main-layout-modal-root"></div>'
    })

    it("opens, updates and closes stacked modals from the provider context", async () => {
        render(
            <ModalProvider>
                <ContextConsumer />
            </ModalProvider>,
        )

        expect(screen.getByTestId("provider-open")).toHaveTextContent("false")
        expect(screen.getByTestId("provider-active-id")).toHaveTextContent("none")

        fireEvent.click(screen.getByRole("button", { name: "open-a" }))

        await waitFor(() => {
            expect(screen.getByTestId("modal-a")).toBeInTheDocument()
        })

        expect(screen.getByTestId("provider-open")).toHaveTextContent("true")
        expect(screen.getByTestId("provider-active-id")).toHaveTextContent("modal-a")
        expect(screen.getByTestId("provider-has-a")).toHaveTextContent("true")
        expect(screen.getByTestId("modal-a")).toHaveTextContent("modal-a")
        expect(screen.getByTestId("modal-a")).toHaveTextContent("true")

        fireEvent.click(screen.getByRole("button", { name: "open-b" }))

        await waitFor(() => {
            expect(screen.getByTestId("modal-b")).toBeInTheDocument()
        })

        expect(screen.getByTestId("provider-active-id")).toHaveTextContent("modal-b")
        expect(screen.getByTestId("modal-a")).toHaveTextContent("false")
        expect(screen.getByTestId("modal-b")).toHaveTextContent("true")

        fireEvent.click(screen.getByRole("button", { name: "reopen-a" }))

        await waitFor(() => {
            expect(screen.getByTestId("modal-a-updated")).toBeInTheDocument()
        })

        expect(screen.queryByTestId("modal-a")).not.toBeInTheDocument()
        expect(screen.getByTestId("provider-active-id")).toHaveTextContent("modal-a")
        expect(screen.getByTestId("modal-a-updated")).toHaveTextContent("true")

        fireEvent.click(screen.getByRole("button", { name: "close-a" }))

        await waitFor(() => {
            expect(screen.queryByTestId("modal-a-updated")).not.toBeInTheDocument()
        })

        expect(screen.getByTestId("provider-active-id")).toHaveTextContent("modal-b")

        fireEvent.click(screen.getByRole("button", { name: "close-last" }))

        await waitFor(() => {
            expect(screen.queryByTestId("modal-b")).not.toBeInTheDocument()
        })

        expect(screen.getByTestId("provider-open")).toHaveTextContent("false")

        fireEvent.click(screen.getByRole("button", { name: "open-a" }))
        fireEvent.click(screen.getByRole("button", { name: "open-b" }))

        await waitFor(() => {
            expect(screen.getByTestId("modal-b")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole("button", { name: "close-all" }))

        await waitFor(() => {
            expect(screen.queryByTestId("modal-a")).not.toBeInTheDocument()
            expect(screen.queryByTestId("modal-b")).not.toBeInTheDocument()
        })
    })

    it("scopes open and close operations when useModal receives a modal id", async () => {
        render(
            <ModalProvider>
                <ScopedConsumer />
            </ModalProvider>,
        )

        expect(screen.getByTestId("scoped-open")).toHaveTextContent("false")
        expect(screen.getByTestId("scoped-active-id")).toHaveTextContent("none")

        fireEvent.click(screen.getByRole("button", { name: "scoped-open" }))

        await waitFor(() => {
            expect(screen.getByTestId("scoped-content")).toBeInTheDocument()
        })

        expect(screen.getByTestId("scoped-open")).toHaveTextContent("true")
        expect(screen.getByTestId("scoped-active-id")).toHaveTextContent("scoped-modal")
        expect(screen.getByTestId("scoped-content")).toHaveTextContent("scoped-modal")

        fireEvent.click(screen.getByRole("button", { name: "scoped-close" }))

        await waitFor(() => {
            expect(screen.queryByTestId("scoped-content")).not.toBeInTheDocument()
        })

        expect(screen.getByTestId("scoped-open")).toHaveTextContent("false")

        fireEvent.click(screen.getByRole("button", { name: "scoped-open" }))

        await waitFor(() => {
            expect(screen.getByTestId("scoped-content")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole("button", { name: "scoped-close-all" }))

        await waitFor(() => {
            expect(screen.queryByTestId("scoped-content")).not.toBeInTheDocument()
        })
    })
})
