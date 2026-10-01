import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useScrollMenuSlideTracker } from "@/presentation/hooks/useScrollMenuSlideTracker";
import type { publicApiType } from "react-horizontal-scrolling-menu";

describe("useScrollMenuSlideTracker", () => {
    it("should initialize with currentSlide as 0", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());
        
        expect(result.current.currentSlide).toBe(0);
        expect(result.current.canScrollLeft).toBe(false);
        expect(result.current.canScrollRight).toBe(false);
        expect(typeof result.current.handleUpdate).toBe("function");
    });

    it("should hide both arrows when all items fit in the scroll container", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            scrollContainer: {
                current: {
                    scrollLeft: 0,
                    scrollWidth: 600,
                    clientWidth: 600,
                },
            },
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(false);
        expect(result.current.canScrollRight).toBe(false);
    });

    it("should show only right arrow at the start when more items exist", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            scrollContainer: {
                current: {
                    scrollLeft: 0,
                    scrollWidth: 1000,
                    clientWidth: 600,
                },
            },
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(false);
        expect(result.current.canScrollRight).toBe(true);
    });

    it("should show only left arrow at the end", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            scrollContainer: {
                current: {
                    scrollLeft: 400,
                    scrollWidth: 1000,
                    clientWidth: 600,
                },
            },
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(true);
        expect(result.current.canScrollRight).toBe(false);
    });

    it("should show both arrows between the first and last items", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            scrollContainer: {
                current: {
                    scrollLeft: 200,
                    scrollWidth: 1000,
                    clientWidth: 600,
                },
            },
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(true);
        expect(result.current.canScrollRight).toBe(true);
    });

    it("should update currentSlide when handleUpdate is called with valid visible items", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            items: {
                getVisible: vi.fn().mockReturnValue([
                    ["item-2", { index: "2", key: "item-2", visible: true }]
                ])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.currentSlide).toBe(2);
    });

    it("should not update currentSlide when no visible items", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.currentSlide).toBe(0);
    });

    it("should not update currentSlide when first visible item is undefined", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            items: {
                getVisible: vi.fn().mockReturnValue([undefined])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.currentSlide).toBe(0);
    });

    it("should not update currentSlide when index is NaN", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            items: {
                getVisible: vi.fn().mockReturnValue([
                    ["item-invalid", { index: "not-a-number", key: "item-invalid", visible: true }]
                ])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.currentSlide).toBe(0);
    });

    it("should update to different slide indices", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi1 = {
            items: {
                getVisible: vi.fn().mockReturnValue([
                    ["item-0", { index: "0", key: "item-0", visible: true }]
                ])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi1);
        });
        expect(result.current.currentSlide).toBe(0);

        const mockApi2 = {
            items: {
                getVisible: vi.fn().mockReturnValue([
                    ["item-3", { index: "3", key: "item-3", visible: true }]
                ])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi2);
        });
        expect(result.current.currentSlide).toBe(3);
    });

    it("should hide both arrows when isFirstItemVisible and isLastItemVisible are true without scrollContainer", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            isFirstItemVisible: true,
            isLastItemVisible: true,
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(false);
        expect(result.current.canScrollRight).toBe(false);
    });

    it("should show both arrows when isFirstItemVisible and isLastItemVisible are false without scrollContainer", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            isFirstItemVisible: false,
            isLastItemVisible: false,
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(true);
        expect(result.current.canScrollRight).toBe(true);
    });

    it("should show only left arrow when only isLastItemVisible is false without scrollContainer", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            isFirstItemVisible: true,
            isLastItemVisible: false,
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(false);
        expect(result.current.canScrollRight).toBe(true);
    });

    it("should show only right arrow when only isFirstItemVisible is false without scrollContainer", () => {
        const { result } = renderHook(() => useScrollMenuSlideTracker());

        const mockApi = {
            isFirstItemVisible: false,
            isLastItemVisible: true,
            items: {
                getVisible: vi.fn().mockReturnValue([])
            }
        } as unknown as publicApiType;

        act(() => {
            result.current.handleUpdate(mockApi);
        });

        expect(result.current.canScrollLeft).toBe(true);
        expect(result.current.canScrollRight).toBe(false);
    });
});
