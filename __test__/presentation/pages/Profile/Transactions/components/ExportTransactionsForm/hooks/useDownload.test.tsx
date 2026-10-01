import { describe, expect, it, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDownload from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/hooks/useDownload";

describe("useDownload", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("creates a downloadable link with the expected file name and encoded payload", () => {
        const click = vi.fn();
        let link: { click: typeof click; download: string; href: string } | null = null;
        const originalCreateElement = document.createElement.bind(document);
        const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName) => {
            if (tagName === "a") {
                link = {
                    click,
                    download: "",
                    href: "",
                };
                return link as any;
            }

            return originalCreateElement(tagName);
        });

        const { result } = renderHook(() => useDownload());

        act(() => {
            result.current.download("archivo con espacios");
        });

        expect(createElementSpy).toHaveBeenCalledWith("a");
        expect(link).not.toBeNull();
        const renderedLink = link as NonNullable<typeof link>;
        expect(renderedLink.download).toBe("history.xls");
        expect(renderedLink.href).toBe(
            "data:application/octet-stream;charset=utf-8,archivo%20con%20espacios",
        );
        expect(click).toHaveBeenCalledTimes(1);
    });
});
