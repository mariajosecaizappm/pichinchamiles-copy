/** Paths where another element owns sticky top-0, so the header must stay static. */
export const USE_YOUR_MILES_BASE_PATH = "/utilice-sus-millas";

export const nonStickyPathsMobile = [USE_YOUR_MILES_BASE_PATH] as const;
export const nonStickyPathsDesktop = [USE_YOUR_MILES_BASE_PATH] as const;

export const matchesPath = (pathname: string, paths: readonly string[]) => {
    const normalizedPath = pathname.replace(/\/$/, "") || "/";
    return paths.some((basePath) => {
        const normalizedBase = basePath.replace(/\/$/, "") || "/";
        return (
            normalizedPath === normalizedBase ||
            normalizedPath.startsWith(`${normalizedBase}/`)
        );
    });
};

export const shouldHeaderStick = (
    pathname: string,
    nonStickyPaths: readonly string[],
) => !matchesPath(pathname, nonStickyPaths);
