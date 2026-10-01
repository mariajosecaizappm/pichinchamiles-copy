import { EXCHANGE_STEPS, ExchangeStep } from "./ExchangeStepsConfig";
import Image from "next/image";

const ExchangeItemStep = ({ step }: { step: ExchangeStep }) => {
    return (
        <article className="w-full grid place-items-center gap-3" aria-labelledby={`step-${step.step}-title`} aria-describedby={`step-${step.step}-description`}>
            <div className="p-2 flex flex-col gap-3 items-center text-center">
                <div className="px-4 border h-9 border-darkGrayishBlue-400 text-blue-500 font-semibold text-sm rounded-3xl flex items-center justify-center" aria-label={`Paso ${step.step} de ${EXCHANGE_STEPS.length}`}>
                    PASO {step.step}/{EXCHANGE_STEPS.length}
                </div>
                <h3 id={`step-${step.step}-title`} className="font-semibold text-xl">
                    {step.title}
                </h3>
                <p id={`step-${step.step}-description`} className="text-sm">
                    {step.description}
                </p>
            </div>
            <div>
                <Image
                    unoptimized
                    src={step.image}
                    alt={step.title}
                    width={180}
                    height={320}
                />
            </div>
        </article>
    );
};

export default ExchangeItemStep;