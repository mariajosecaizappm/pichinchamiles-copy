import FormSelect from "@/presentation/components/Form/controls/FormSelect";
import { airlines, classes, stopOptions } from "../data";

const AdvancedOptionsFields = () => {
    return (
        <>
            <FormSelect
                name="stops"
                label="Escalas"
                testId="stops"
                aria-label="Escoge las escalas de tu viaje"
                selectorIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 10L12 15L17 10H7Z" fill="#0F265C" />
                    </svg>
                }
                placeholder="Todas las escalas"
                options={stopOptions}
            />
            <FormSelect
                name="class"
                label="Clase"
                testId="class"
                aria-label="Escoge la clase de tu viaje"
                placeholder="Todas las clases"
                options={classes}
            />
            <FormSelect
                name="airline"
                label="Aerolínea"
                testId="airline"
                aria-label="Escoge la aerolínea de tu viaje"
                placeholder="Todas las aerolíneas"
                options={airlines}
            />
        </>
    );
};

export default AdvancedOptionsFields;