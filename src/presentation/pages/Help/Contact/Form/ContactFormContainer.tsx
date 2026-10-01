"use client"

import { Member } from "@/domain/entity/Member/member";
import { Requeriment } from "@/domain/entity/Pqrs/requirement";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import CreateRequerimentUseCase from "@/domain/interactors/Faq/CreateRequerimentUseCase";
import GetRequierimentTypesUseCase from "@/domain/interactors/Faq/GetRequierimentTypesUseCase";
import { FormRef } from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import ContactForm from "./ContactForm";
import { getMemberFullNameCapitalized } from "@/presentation/helpers/member";

type Props = {
    member: Member;
}

const ContactFormContainer = ({ member }: Props) => {

    const getRequirementTypesUseCase = container.get<GetRequierimentTypesUseCase>(UseCaseTypes.GetRequierimentTypesUseCase);
    const createRequerimentUseCase = container.get<CreateRequerimentUseCase>(UseCaseTypes.CreateRequerimentUseCase);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)
    const [formKey, setFormKey] = useState(0)

    const memberInformationForm = {
        fullname: getMemberFullNameCapitalized(member) || "",
        email: member.enrollmentEmail || "",
        identificationType: member.identificationType || "",
        identificationNumber: member.identificationNumber || "",
    }

    const formRef = useRef<FormRef>(null);

    const getTypes = () => getRequirementTypesUseCase.execute();


    const { data: types = [] } = useQuery({
        queryKey: ["getTypes"],
        queryFn: getTypes
    });


    const createRequeriment = async (values: Requeriment) => {
        await createRequerimentUseCase.addPqrs(values);
        setIsSuccessOpen(true)
    };

    const handleOpenSuccessChange = (open: boolean) => {
        setIsSuccessOpen(open)
        if (!open) {
            setFormKey((key) => key + 1)
        }
    }

    return (
        <ContactForm
            key={formKey}
            memberInformation={memberInformationForm}
            formRef={formRef}
            onCreateRequeriment={createRequeriment}
            requierimentTypes={types}
            isSuccessOpen={isSuccessOpen}
            onOpenSuccessChange={handleOpenSuccessChange}
        />
    )
};

export default ContactFormContainer;