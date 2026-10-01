export const getActiveTabIndex = (
    isFlightsActive: boolean,
    isHotelsActive: boolean,
    isCarsActive: boolean,
    isActivitiesActive: boolean,
    isDisneyActive: boolean
): number => {
    if (isFlightsActive) return 0;
    if (isHotelsActive) return 1;
    if (isCarsActive) return 2;
    if (isActivitiesActive) return 3;
    if (isDisneyActive) return 4;
    return 0;
};