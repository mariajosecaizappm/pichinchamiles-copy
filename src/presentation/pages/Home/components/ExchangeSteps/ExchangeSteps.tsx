import { EXCHANGE_STEPS } from "./ExchangeStepsConfig";
import ExchangeItemStep from "./ExchanteItemStep";
import dynamic from "next/dynamic";

const MobileExchangeStepsCarousel = dynamic(() => import("./MobileExchangeStepsCarousel/MobileExchangeStepsCarousel"));

const ExchangeSteps = () => {
    return (
        <section className="w-full bg-darkGrayishBlue-50" aria-labelledby="exchange-steps-title">
            <div className="w-full md:home-body-container p-6 md:py-10 flex flex-col gap-6">
                <div className="flex gap-10 flex-col items-start self-stretch">
                    <div className="space-y-4 text-center w-full">
                        <h2 id="exchange-steps-title" className="text-[28px] text-blue-500 typo-main-title">
                            Canjear tus millas es muy fácil
                        </h2>
                        <p className="text-grayscale-500">
                            Sigue estos 3 simples pasos para disfrutar de tus recompensas.
                        </p>
                    </div>
                </div>
                <ul className="hidden md:grid grid-cols-3 gap-6 w-full list-none m-0 p-0" aria-label="Pasos para canjear millas">
                    {EXCHANGE_STEPS.map((step) => (
                        <li key={step.title} className="grid">
                            <ExchangeItemStep step={step} />
                        </li>
                    ))}
                </ul>
                <div className="w-full md:hidden">
                    <MobileExchangeStepsCarousel />
                </div>
            </div>
        </section>
    );
};




export default ExchangeSteps;