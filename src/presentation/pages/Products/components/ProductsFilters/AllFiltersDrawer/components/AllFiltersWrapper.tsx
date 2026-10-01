import { Drawer, DrawerBody, DrawerContent } from "@heroui/react"
import FilterDrawerHeader from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerHeader"
import AllFiltersTrigger from "./AllFiltersTrigger"
import FilterDrawerFooter from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/FilterDrawerFooter"

type Props = {
    isOpen: boolean
    onOpen: () => void
    onOpenChange: () => void
    handleClose: () => void
    children: React.ReactNode
    onClearFilters: () => void
    onApplyFilters: () => void
}

const AllFiltersWrapper = ({ isOpen, onOpen, onOpenChange, handleClose, children, onClearFilters, onApplyFilters }: Props) => {
    return (
        <>
            <AllFiltersTrigger onOpen={onOpen} />
            <Drawer
                size="2xl"
                isKeyboardDismissDisabled={true}
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open) handleClose()
                    onOpenChange()
                }}
                placement="bottom"
                className="font-sans"
                hideCloseButton={true}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <FilterDrawerHeader onClose={() => {
                                handleClose()
                                onClose()
                            }} />
                            <DrawerBody className="py-0 flex flex-col gap-0">
                                {children}
                            </DrawerBody>
                            <FilterDrawerFooter
                                onClearFilters={onClearFilters}
                                onApplyFilters={onApplyFilters}
                            />
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default AllFiltersWrapper