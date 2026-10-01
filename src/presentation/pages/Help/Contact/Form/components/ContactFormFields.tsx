import { RequerimentType } from "@/domain/entity/Pqrs/requirement";
import FormContext from "@/presentation/components/Form/context/FormContext";
import FormInput from "@/presentation/components/Form/controls/FormInput";
import FormSelect from "@/presentation/components/Form/controls/FormSelect";
import FormTextArea from "@/presentation/components/Form/controls/FormTextArea";
import { typesDocuments } from "@/presentation/forms/AddressForm/typesDocuments";
import { useContext, useEffect, useMemo, useRef } from "react";


type Props = {
    requierimentTypes: RequerimentType[];
}

const ContactFormFields = ({ requierimentTypes }: Props) => {
    const { values, setFieldValue } = useContext(FormContext);
    const previousTypeIdRef = useRef(values.pqrsRequirementTypeId);

    useEffect(() => {
        const previousTypeId = previousTypeIdRef.current;
        previousTypeIdRef.current = values.pqrsRequirementTypeId;

        if (!previousTypeId || !values.pqrsRequirementTypeId || previousTypeId === values.pqrsRequirementTypeId) {
            return;
        }

        setFieldValue("pqrsRequirementSubTypeId", "");
    }, [values.pqrsRequirementTypeId, setFieldValue]);
    
    const filteredRequirementSubtypes = useMemo(() => {
        const requirementType = requierimentTypes.find(requirementType => requirementType.id === values.pqrsRequirementTypeId);
        return requirementType ? requirementType.subtypes : []
    }, [values.pqrsRequirementTypeId, requierimentTypes])
    
    return (
        <div className="flex flex-col gap-2.5">
            <div id="contactFormAlert" />
            <FormInput
                name="fullname"
                label="Nombres y apellidos"
                placeholder="Manuel Antonio Sosa Taco "
                readOnly
                disabled
                displayValue={values.fullname?.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
            />
            <FormInput
                name="identificationType"
                label="Tipo de identificación"
                displayValue={typesDocuments.find(doc => doc.id === values.identificationType)?.name}
                readOnly
                disabled
            />
            <FormInput
                name="identificationNumber"
                label="Documento de identificación"
                readOnly
                disabled
            />
            <FormInput
                name="email"
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                type="email"
                inputMode="email"
                autoComplete="email"
            />
            <FormSelect
                name="pqrsRequirementTypeId"
                label="Categoría del requerimiento"
                placeholder="Selecciona una opción"
                options={requierimentTypes.map(type => ({ id: type.id, name: type.name }))}
            />
            <FormSelect
                name="pqrsRequirementSubTypeId"
                label="Motivo del requerimiento"
                placeholder="---"
                options={filteredRequirementSubtypes.map(subtype => ({ id: subtype.id, name: subtype.name }))}
                disabled={!values.pqrsRequirementTypeId}
            />
            <FormTextArea
                name="description"
                label="Descripción del requerimiento"
                description={`${values.description?.length || 0} caracteres`}
                placeholder="---"
                regExp={/^[\s\S]{0,200}$/}
            />
        </div>
    )
}

export default ContactFormFields