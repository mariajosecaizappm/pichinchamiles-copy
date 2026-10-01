"use client"

import { useState, useRef, useCallback } from "react";

export type ImageGestureHandlers = {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
}

export type UseImageGesturesReturn = {
    scale: number;
    translate: { x: number; y: number };
    handlers: ImageGestureHandlers;
    reset: () => void;
}

export const useImageGestures = (): UseImageGesturesReturn => {
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const lastTap = useRef(0);
    const lastDistance = useRef<number | null>(null);
    const isPanning = useRef(false);
    const lastPointer = useRef({ x: 0, y: 0 });

    const reset = useCallback(() => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    }, []);

    const getDistance = (touches: React.TouchList) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const now = Date.now();
            if (now - lastTap.current < 300) {
                setScale(prev => (prev > 1 ? 1 : 2.5));
                setTranslate({ x: 0, y: 0 });
            }
            lastTap.current = now;
            isPanning.current = true;
            lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            isPanning.current = false;
            lastDistance.current = getDistance(e.touches);
        }
    }, []);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 2 && lastDistance.current !== null) {
            const newDist = getDistance(e.touches);
            setScale(prev => Math.min(Math.max(prev * (newDist / lastDistance.current!), 1), 5));
            lastDistance.current = newDist;
        } else if (e.touches.length === 1 && isPanning.current) {
            const dx = e.touches[0].clientX - lastPointer.current.x;
            const dy = e.touches[0].clientY - lastPointer.current.y;
            setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, []);

    const onTouchEnd = useCallback(() => {
        lastDistance.current = null;
        isPanning.current = false;
        setScale(prev => (prev < 1.05 ? 1 : prev));
    }, []);

    return { scale, translate, handlers: { onTouchStart, onTouchMove, onTouchEnd }, reset };
};
