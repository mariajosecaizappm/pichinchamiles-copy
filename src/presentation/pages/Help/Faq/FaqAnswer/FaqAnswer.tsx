"use client"

import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

type FaqAnswerProps = {
    html: string;
    className?: string;
}

const FaqAnswer = ({ html, className = '' }: FaqAnswerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const sanitizedHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html;

    useEffect(() => {
        if (!ref.current) return;

        const anchors = ref.current.querySelectorAll<HTMLAnchorElement>('a');
 
        anchors.forEach((anchor) => {
            if (anchor.hasAttribute('target')) return;

            const href = anchor.getAttribute('href') ?? '';
            if (!href) return;

            let isExternal = false;

            if (href.startsWith('http')) {
                try {
                    isExternal = new URL(href).origin !== window.location.origin;
                } catch {
                    isExternal = true;
                }
            }

            if (isExternal) {
                anchor.setAttribute('target', '_blank');
                anchor.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }, []);

    return (
        <div
            ref={ref}
            className={`wrap-break-word ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};

export default FaqAnswer