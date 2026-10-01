import { useEffect, RefObject } from "react";

export const useScrollActiveItemIntoView = (
    activeItemRef: RefObject<HTMLDivElement | null>,
    deps: React.DependencyList
) => {
    useEffect(() => {
        const el = activeItemRef.current;
        if (!el) return;
        let scrollParent = el.parentElement;
        while (scrollParent && scrollParent.scrollWidth <= scrollParent.clientWidth) {
            scrollParent = scrollParent.parentElement;
        }
        if (!scrollParent) return;
        const elRect = el.getBoundingClientRect();
        const containerRect = scrollParent.getBoundingClientRect();
        const isFullyVisible = elRect.left >= containerRect.left && elRect.right <= containerRect.right;
        if (!isFullyVisible) {
            el.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeItemRef, ...deps]);
};
