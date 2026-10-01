import { Button } from "@/presentation/components/Form/components/Button";
import { useTransition } from "react";

type Props = {
    onApplyFilters: () => void;
}

const ApplyFiltersAction = ({ onApplyFilters }: Props) => {
    const [isPending, startTransition] = useTransition();

    const handleApplyFilters = () => {
        startTransition(() => {
            onApplyFilters();
        });
    };

    return (
        <Button
            onPress={handleApplyFilters}
            isLoading={isPending}
            startContent={!isPending ? (
                <span className="w-6 h-6 flex items-center justify-center">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.59 10.58L1.42 6.41L0 7.82L5.59 13.41L17.59 1.41L16.18 0L5.59 10.58Z" fill="currentColor" />
                    </svg>
                </span>
            ) : null}
            className="flex-1 h-10 leading-6 text-sm"
            color="primary"
        >
            Ver resultados
        </Button>
    )
}

export default ApplyFiltersAction