import { Button } from "@/presentation/components/Form/components/Button";
import { useTransition } from "react";

type Props = {
    onClearFilters: () => void;
}

const ClearFiltersAction = ({ onClearFilters }: Props) => {
    const [isPending, startTransition] = useTransition();


    const handleClearFilters = () => {
        startTransition(() => {
            onClearFilters();
        });
    };


    return (
        <Button
            startContent={
                !isPending ? (
                    <span className="w-6 h-6 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor" />
                        </svg>
                    </span>
                ) : null
            }
            className="flex-1 h-10 leading-6 text-sm border border-darkGrayishBlue-300"
            color="secondary"
            isLoading={isPending}
            onPress={handleClearFilters}>
            Eliminar filtros
        </Button>
    )
}

export default ClearFiltersAction