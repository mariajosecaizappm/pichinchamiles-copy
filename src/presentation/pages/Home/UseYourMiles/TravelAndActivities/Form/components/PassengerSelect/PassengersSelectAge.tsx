import React from "react";
import FormSelect from "@/presentation/components/Form/controls/FormSelect/FormSelect";
import { MAX_CHILDREN_AGES } from "../../../Hotels/Form/HotelsFormConfig";

interface PassengersSelectAgeProps {
    childrenCount: number;
    className?: string;
}

const PassengersSelectAge: React.FC<PassengersSelectAgeProps> = ({
    childrenCount,
    className
}) => {
    if (childrenCount === 0) return null;

    const ageOptions = Array.from({ length: MAX_CHILDREN_AGES }, (_, index) => ({
        id: (index + 1).toString(),
        name: (index + 1).toString()
    }));

    return (
        <div className={`space-y-2 ${className ?? ""}`}>
            {Array.from({ length: childrenCount }, (_, index) => (
                <div key={`ageChildren${index + 1}`} className="flex  items-center self-stretch justify-between px-4 py-2 gap-2.5">
                    <span className="text-sm leading-6 font-medium text-grayscale-400">Edad del menor</span>
                    <div className="flex w-full max-w-[91.29px] border-none items-center rounded-sm gap-2.5 border border-grayscale-200">
                        <FormSelect
                            name={`ageChildren${index + 1}`}
                            options={ageOptions}
                            defaultSelectedKeys={["1"]}
                            classNames={{
                                trigger: "h-[33.66px] min-h-[33.66px] px-[20px]",
                            }}
                            listboxProps={{
                                itemClasses:{
                                    base:'h-[33.66px]'
                                }
                            }}
                            iconColor="#0F265C"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PassengersSelectAge;
