import IconSearch from "@/presentation/components/icons/IconSearch";
import colors from "@/presentation/style/colors";
import clsx from "clsx";
import { Input } from "../Input";

interface SearchInputProps extends Omit<
    React.ComponentProps<typeof Input>,
    'onChange' | 'onFocus' | 'onBlur' | 'onKeyDown' | 'onClick' | 'value'
> {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    displayOnly?: boolean;
    hideFocusRing?: boolean;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

const SearchInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    displayOnly = false,
    placeholder,
    hideFocusRing = false,
    inputRef,
    ...props
}: SearchInputProps) => {

    return (
        <Input
            variant="bordered"
            labelPlacement="outside"
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => !displayOnly && onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={displayOnly}
            startContent={<IconSearch color={colors.grayscale[300]} />}
            classNames={{
                inputWrapper: clsx(
                    "shadow-none border border-darkGrayishBlue-300 data-[hover=true]:border-information-500 p-3 rounded-lg h-12 transition-all duration-200 bg-white",
                    !hideFocusRing && "group-data-[focus=true]:border-information-500 group-data-[focus=true]:data-[hover=true]:border-information-500 group-data-[focus=true]:ring-2 group-data-[focus=true]:ring-information-500",
                    hideFocusRing && "group-data-[focus=true]:border-darkGrayishBlue-300 group-data-[focus=true]:ring-0 group-data-[focus=true]:ring-transparent outline-none",
                    displayOnly && "cursor-pointer"
                ),
                input: clsx(
                    "placeholder:text-grayscale-400 leading-6 outline-none focus:outline-none",
                    ...(props.className ? [props.className] : []),
                    displayOnly && "cursor-pointer"
                )
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoCorrect="on"
            autoCapitalize="none"
            autoComplete="off"
            aria-invalid={false}
            {...props}
        />
    )
}

export default SearchInput