import { useEffect, useRef } from 'react';

interface UseFocusTrapProps {
    isActive: boolean;
    onEscape?: () => void;
}

export const useFocusTrap = ({ isActive, onEscape }: UseFocusTrapProps) => {
    const containerRef = useRef<HTMLElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive) return;

        // Store the currently focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        const container = containerRef.current;
        if (!container) return;

        // Get all focusable elements within the container
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus the first element
        if (firstElement) {
            firstElement.focus();
        }

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
                return;
            }

            // Tab (forward)
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onEscape?.();
            }
        };

        container.addEventListener('keydown', handleTabKey);
        document.addEventListener('keydown', handleEscape);

        return () => {
            container.removeEventListener('keydown', handleTabKey);
            document.removeEventListener('keydown', handleEscape);
            
            // Restore focus to the previously focused element
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [isActive, onEscape]);

    return containerRef;
};
