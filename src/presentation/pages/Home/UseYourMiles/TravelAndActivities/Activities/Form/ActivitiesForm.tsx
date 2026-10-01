"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import Form from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import ActivitiesFormFields from "./components/ActivitiesFormFields";
import {
    activitiesInitialValues,
    activitiesSchema,
    ActivitiesValues,
    onActivityFormError,
    parseValuesToParams
} from "./ActivitiesFormConfig";
import GetActivitiesSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetActivitiesSearchUrlUseCase";
import { useTransition } from "react";
import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession";

const ActivitiesForm = () => {
    const [, startTransition] = useTransition();
    const { verifyUvSession } = useUvSession();

    const getActivitiesSearchUrl = container.get<GetActivitiesSearchUrlUseCase>(
        UseCaseTypes.GetActivitiesSearchUrlUseCase
    );

    const goToUrl = async (
        values: ActivitiesValues,
    ) => {
        await verifyUvSession();
        startTransition(() => {
            const params = parseValuesToParams(values);
            const url = getActivitiesSearchUrl.execute(params);
            window.open(url, '_self');
        });
    };

    return (
        <Form
            initialValues={activitiesInitialValues}
            onSubmit={goToUrl}
            schema={activitiesSchema}
            onError={onActivityFormError}
            formErrorId="activitiesFormError"
            className="pb-6 pt-3 body-container"
        >
            <ActivitiesFormFields />
        </Form>
    );
};

export default ActivitiesForm;
