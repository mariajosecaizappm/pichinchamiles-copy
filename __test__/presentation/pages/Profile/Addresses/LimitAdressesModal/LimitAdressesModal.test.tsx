import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import LimitAdressesModal from "@/presentation/pages/Profile/Addresses/LimitAdressesModal/LimitAdressesModal"

type MockModalProps = {
    isOpen?: boolean;
    onClose?: (isOpen: boolean) => void;
    children?: ReactNode;
    placement?: string;
    title?: string;
    classNames?: Record<string, string>;
    headerButton?: ReactNode;
    [key: string]: unknown;
}

type Mocks = {
    setLastModalProps: (props: MockModalProps) => void;
    lastModalProps: MockModalProps | null;
};

const mocks = vi.hoisted<Mocks>(() => ({
    setLastModalProps: (props) => {
        mocks.lastModalProps = props
    },
    lastModalProps: null,
}))

vi.mock("@/presentation/components/Modal", () => ({
    default: (props: MockModalProps) => {
        mocks.setLastModalProps(props)
        if (!props.isOpen) return null
        return (
            <div data-testid="mock-modal">
                <button
                    type="button"
                    data-testid="mock-modal-close"
                    onClick={() => props.onClose?.(false)}
                >
                    close
                </button>
                {props.children}
            </div>
        )
    },
}))

vi.mock("@heroui/react", () => {
    const MockButton = ({
        children,
        onPress,
        color,
        ...rest
    }: ButtonHTMLAttributes<HTMLButtonElement> & { onPress?: () => void; color?: string }) => (
        <button type="button" data-color={color} onClick={onPress} {...rest}>
            {children}
        </button>
    );

    return {
        Divider: () => <hr data-testid="divider" />,
        Button: MockButton,
        extendVariants: () => MockButton,
    };
})

describe("LimitAdressesModal", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.lastModalProps = null
    })

    it("should hide content when the modal is closed", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        fireEvent.click(screen.getByTestId("mock-modal-close"))

        expect(screen.queryByText("Límite alcanzado")).toBeNull()
    })

    it("should render title and description when isOpen is true", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        expect(screen.getByRole("heading", { name: "Límite alcanzado" })).toBeInTheDocument()
        expect(screen.getByText(/Ya tienes 10 direcciones registradas/)).toBeInTheDocument()
        expect(screen.getByText(/Elimina una para poder agregar una nueva\./)).toBeInTheDocument()
    })

    it("should render the divider", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        expect(screen.getByTestId("divider")).toBeInTheDocument()
    })

    it("should render the 'Administrar direcciones' button with primary color", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        const button = screen.getByRole("button", { name: "Administrar direcciones" })
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute("data-color", "primary")
    })

    it("should call onClose when 'Administrar direcciones' button is clicked", () => {
        const onClose = vi.fn()

        render(<LimitAdressesModal onClose={onClose} />)

        fireEvent.click(screen.getByRole("button", { name: "Administrar direcciones" }))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("should call onClose when the modal is closed", () => {
        const onClose = vi.fn()

        render(<LimitAdressesModal onClose={onClose} />)

        fireEvent.click(screen.getByTestId("mock-modal-close"))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("should pass placement, title and classNames to Modal", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        expect(mocks.lastModalProps!.placement).toBe("center")
        expect(mocks.lastModalProps!.title).toBe("Límite alcanzado")
        expect(mocks.lastModalProps!.classNames).toEqual({
            wrapper: "p-4!",
            base: "h-min rounded-lg!",
            body: "p-0 max-h-min",
        })
    })

    it("should pass isOpen through to Modal", () => {
        render(<LimitAdressesModal onClose={vi.fn()} />)

        expect(mocks.lastModalProps!.isOpen).toBe(true)
    })

    it("should render without onClose prop using default parameter", () => {
        render(<LimitAdressesModal />)

        expect(screen.getByRole("heading", { name: "Límite alcanzado" })).toBeInTheDocument()
    })

    it("should not throw when modal is closed without onClose prop", () => {
        render(<LimitAdressesModal />)

        fireEvent.click(screen.getByTestId("mock-modal-close"))

        expect(screen.queryByText("Límite alcanzado")).toBeNull()
    })

    it("should not throw when 'Administrar direcciones' button is clicked without onClose prop", () => {
        render(<LimitAdressesModal />)

        fireEvent.click(screen.getByRole("button", { name: "Administrar direcciones" }))

        expect(screen.queryByText("Límite alcanzado")).toBeNull()
    })
})
