export type AllFiltersDrawerProps = {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    handleClose: () => void;
    onClearFilters: () => void;
    onApplyFilters: () => void;
    children: React.ReactNode;
}
