"use client";

import type { ComponentType, SVGProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import IconStepperAddress from "@/presentation/components/icons/IconStepperAddress";
import IconStepperBilling from "@/presentation/components/icons/IconStepperBilling";
import IconStepperRedemption from "@/presentation/components/icons/IconStepperRedemption";
import ShoppingCartStepperStep from "./ShoppingCartStepperStep";

type StepIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const STEPS: ReadonlyArray<{
    id: number;
    Icon?: StepIconComponent;
    iconify?: string;
}> = [
    { id: 1, iconify: "mdi:cart-outline" },
    { id: 2, Icon: IconStepperAddress },
    { id: 3, Icon: IconStepperBilling },
    { id: 4, Icon: IconStepperRedemption },
];

type ShoppingCartStepperProps = {
    currentStep?: number;
};

const ShoppingCartStepper = ({ currentStep = 1 }: ShoppingCartStepperProps) => {
    return (
        <div className="relative w-full">
            <div
                className="absolute left-[29px] right-[37px] top-5 h-px bg-grayscale-300 lg:left-[75px] lg:right-[75px] lg:top-[34px]"
                aria-hidden="true"
            />
            <ol className="relative flex items-start justify-between">
                {STEPS.map(step => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    const StepIcon = step.Icon;

                    const icon = StepIcon ? (
                        <StepIcon className="h-auto max-h-full w-full max-w-full" aria-hidden />
                    ) : (
                        <IconifyIcon
                            icon={step.iconify ?? "mdi:cart-outline"}
                            className="size-5 lg:size-6"
                            aria-hidden
                        />
                    );

                    return (
                        <ShoppingCartStepperStep
                            key={step.id}
                            stepId={step.id}
                            icon={icon}
                            isActive={isActive}
                            isCompleted={isCompleted}
                        />
                    );
                })}
            </ol>
        </div>
    );
};

export default ShoppingCartStepper;
