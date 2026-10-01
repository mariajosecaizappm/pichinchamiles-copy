import Counter from "@/presentation/components/Form/components/Counter";
import { Category } from "./types";

type PassengerSelectItemProps = Category & {
    onChange: (value: number) => void;
}

const PassengerSelectItem = ({ label, min, max, value, onChange, state }: PassengerSelectItemProps) => {
    const count = value
    const isReadonly = state === 'readonly'
    return (
        <div
            className="flex items-center self-stretch justify-between px-4 py-2 gap-2.5"
        >
            <span className="text-sm leading-6 font-medium text-grayscale-400">{label}</span>
            <div className="flex flex-col items-start">
                <Counter
                    count={count}
                    min={min}
                    max={max}
                    isReadonly={isReadonly}
                    label={label}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default PassengerSelectItem;