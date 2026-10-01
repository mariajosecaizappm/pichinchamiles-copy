"use client"
import {useEffect, useState} from "react";

function useIsDesktop(breakpoint = 768) {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

        const handleMediaChange = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, [breakpoint]);

    return {
        isDesktop
    };
}

export default useIsDesktop;
