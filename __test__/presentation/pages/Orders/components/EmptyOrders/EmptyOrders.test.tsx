import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/image", () => ({
    default: (props: any) => <img {...props} alt={props.alt} />,
}));

vi.mock("next/link", () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ children, as: Component = "button", ...props }: any) => {
        if (Component === "button") {
            return <button {...props}>{children}</button>;
        }
        const LinkComponent = Component;
        return <LinkComponent {...props}>{children}</LinkComponent>;
    },
}));

vi.mock("@/presentation/config/links", () => ({
    default: {
        productsList: "/productos",
    },
}));

import EmptyOrders from "@/presentation/pages/Orders/components/EmptyOrders/EmptyOrders";

describe("EmptyOrders", () => {
    it("renders illustration image", () => {
        render(<EmptyOrders />);

        const image = screen.getByAltText("Ilustración historial de pedidos vacío");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("width", "240");
        expect(image).toHaveAttribute("height", "240");
    });

    it("renders empty state message", () => {
        render(<EmptyOrders />);

        expect(
            screen.getByText(
                "Tus próximos beneficios te esperan. Realiza tu primer pedido cuando quieras."
            )
        ).toBeInTheDocument();
    });

    it("renders catalog button with correct link", () => {
        render(<EmptyOrders />);

        const button = screen.getByText("Ver catálogo");
        expect(button).toBeInTheDocument();

        const link = button.closest("a");
        expect(link).toHaveAttribute("href", "/productos");
    });

    it("applies correct styling classes", () => {
        const { container } = render(<EmptyOrders />);

        const mainContainer = container.querySelector(".flex.flex-1.flex-col.gap-4");
        expect(mainContainer).toBeInTheDocument();
        expect(mainContainer).toHaveClass(
            "text-blue-500",
            "p-4",
            "rounded-lg",
            "border",
            "border-information-100",
            "h-min"
        );
    });
});
