import { Button } from "@/presentation/components/Form/components/Button";
import { cn } from "@heroui/react";

type ToggleFilterProps = {
    className?: string;
    isActive?: boolean;
} & React.ComponentProps<typeof Button>

const ToggleFilter = ({ className, isActive, ...props }: ToggleFilterProps) => {
    return (
        <Button
            data-active={isActive}
            className={cn("inline-flex w-fit max-w-fit h-9 py-2.5 px-2 leading-4 text-xs font-medium rounded-lg border border-darkGrayishBlue-300 data-[active=true]:bg-blue-500 data-[active=true]:border-blue-500 data-[active=true]:text-white", className)}
            variant={"bordered"}
            type={"button"}
            {...props}
        />
    );
};

export default ToggleFilter;