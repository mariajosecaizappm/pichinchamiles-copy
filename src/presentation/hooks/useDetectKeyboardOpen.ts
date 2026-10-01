"use client"
import { useEffect, useState } from "react";

function useDetectKeyboardOpen(minKeyboardHeight = 300, defaultValue = false) {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(defaultValue);

    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) {
            return;
        }

        const listener = () => {
            const newState =
                window.screen.height - minKeyboardHeight > window.visualViewport!.height;
            setIsKeyboardOpen((prev) => (prev !== newState ? newState : prev));
        };

        listener();
        window.visualViewport.addEventListener("resize", listener);

        return () => {
            window.visualViewport?.removeEventListener("resize", listener);
        };
    }, [minKeyboardHeight]);

    return isKeyboardOpen;
}

export default useDetectKeyboardOpen;
