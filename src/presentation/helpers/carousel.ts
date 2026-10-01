/**
 * Resolves the active slide index for a horizontal snap carousel.
 * Uses each child's center vs the viewport center so it works when cards
 * are narrower than the container (e.g. max-width + gap + padding).
 */
export const getScrollSnapSlideIndex = (container: HTMLElement): number => {
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return 0;

    const containerRect = container.getBoundingClientRect();
    const viewportCenter = containerRect.left + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (!child) continue;

        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(childCenter - viewportCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    }

    return closestIndex;
};
