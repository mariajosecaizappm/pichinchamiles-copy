import { Drawer, DrawerBody, DrawerContent, useDisclosure } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import MobileFilterTrigger from "../MobileFilterTrigger";
import FilterDrawerFooter from "./FilterDrawerFooter/FilterDrawerFooter";
import FilterDrawerHeader from "./FilterDrawerHeader";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";

type Props = {
    triggerLabel: string;
    filterKeys: string | string[];
    children: React.ReactNode;
    disabled?: boolean;
    isOpen?: boolean;
    onApplyFilters: () => void;
    onClearFilters?: (onClose: () => void) => void;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    isLoading?: boolean;
}

const FilterDrawer = ({ triggerLabel, filterKeys, children, onApplyFilters, onClearFilters, onOpenChange, isOpen, disabled, onClose, isLoading = false }: Props) => {
    const { isOpen: defaultIsOpen, onOpen, onOpenChange: internalOnOpenChange } = useDisclosure();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();
    const closeSourceRef = useRef<"action" | null>(null);
    const {isDesktop} = useIsDesktop(999)

    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];
    const activeCount = keys.reduce((acc, key) => {
        return acc + (searchParams.getAll(key)[0]?.split(",").length ?? 0)
    }, 0)

    const resolvedOnOpenChange = (open: boolean) => {
        if (!open && !closeSourceRef.current) {
            startTransition(() => {
                onApplyFilters();
            });
        }

        closeSourceRef.current = null;

        if (onOpenChange) {
            onOpenChange(open);
        } else {
            internalOnOpenChange();
        }
    };
    const resolvedOnOpen = () => (onOpenChange ? onOpenChange(true) : onOpen());
    
    

    const handleClearFilters = (onClose: () => void) => {
        closeSourceRef.current = "action";
        onClose();
        onClearFilters?.(onClose);
    };

    const handleClose = (onInternalClose: () => void) => {
        closeSourceRef.current = "action";
        onInternalClose();
        onClose?.();
    };

    const handleApplyFilters = () => {
        closeSourceRef.current = "action";
        onApplyFilters();
    };

    return (
        <>
            <MobileFilterTrigger isLoading={isPending || isLoading} disabled={disabled} onClick={resolvedOnOpen} count={activeCount}>
                {triggerLabel}
            </MobileFilterTrigger>
            <Drawer
                isKeyboardDismissDisabled={true}
                isOpen={(isOpen ?? defaultIsOpen) && !isDesktop}
                onOpenChange={resolvedOnOpenChange}
                placement="bottom"
                className="font-sans"
                hideCloseButton={true}
            >

                <DrawerContent>
                    {(onClose) => (
                        <>
                            <FilterDrawerHeader onClose={() => handleClose(onClose)} />
                            <DrawerBody className="py-3">
                                {children}
                            </DrawerBody>
                            <FilterDrawerFooter
                                onClearFilters={() => {
                                    handleClearFilters(onClose);
                                }}
                                onApplyFilters={handleApplyFilters}
                            />
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default FilterDrawer;