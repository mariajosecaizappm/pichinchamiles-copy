"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import Form from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import DisneyFormFields from "./components/DisneyFormFields";
import { disneyInitialValues, disneySchema, DisneyValues, parseValuesToParams } from "./DisneyFormConfig";
import { useTransition } from "react";
import GetDisneySearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetDisneySearchUrlUseCase";
import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession";

const DisneyForm = () => {
    const [, startTransition] = useTransition();
    const { verifyUvSession } = useUvSession();

    const getDisneySearchUrl = container.get<GetDisneySearchUrlUseCase>(
        UseCaseTypes.GetDisneySearchUrlUseCase
    );

    const goToUrl = async (
        values: DisneyValues,
    ) => {
        await verifyUvSession();
        startTransition(() => {
            const params = parseValuesToParams(values);
            const url = getDisneySearchUrl.execute(params);
            window.open(url, '_self');
        });
    };

    return (
        <Form
            initialValues={disneyInitialValues}
            onSubmit={goToUrl}
            schema={disneySchema}
            formErrorId="disneyFormError"
            className="pb-6 pt-3 body-container"
        >
            <DisneyFormFields />
        </Form>
    );
};

export default DisneyForm;
