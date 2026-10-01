export function isMobileDevice() {
    if (globalThis.window === undefined) return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isSmallScreen = globalThis.window.innerWidth <= 768;
    const isTouch = 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0;
    let hasOrientation = false;
    if (screen.orientation) {
        const orientation = screen.orientation.type;
        hasOrientation = orientation.includes("portrait") || orientation.includes("landscape");
    }

    return isMobileUserAgent && (isSmallScreen || isTouch || hasOrientation);
}
