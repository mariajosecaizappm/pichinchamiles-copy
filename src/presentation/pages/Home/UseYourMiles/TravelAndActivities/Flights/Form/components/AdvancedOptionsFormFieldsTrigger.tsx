"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { FormCheckbox } from "@/presentation/components/Form/controls/FormCheckbox";
import FormContext from "@/presentation/components/Form/context/FormContext";

const AdvancedOptionsTrigger = () => {
    const { values } = useContext(FormContext);
    const [liveMessage, setLiveMessage] = useState('');
    const prevValue = useRef<boolean | undefined>(undefined);

    useEffect(() => {
        const current = !!values.showAdvancedOptions;
        if (prevValue.current !== undefined && prevValue.current !== current) {
            setLiveMessage(current ? 'Opciones avanzadas expandidas' : 'Opciones avanzadas colapsadas');
        }
        prevValue.current = current;
    }, [values.showAdvancedOptions]);

    return (
        <div>
            <FormCheckbox
                name="showAdvancedOptions"
                testId="showAdvancedOptions"
                label="Opciones avanzadas"
                labelClassName="text-grayscale-500 font-medium leading-5"
                className="gap-2"
                aria-label="Opciones avanzadas despliegan 3 opciones adicionales para definir el número de escalas, la clase y la aerolínea."
                aria-expanded={!!values.showAdvancedOptions}
            />
            <output aria-live="polite" className="sr-only">{liveMessage}</output>
        </div>
    );
}

export default AdvancedOptionsTrigger;
