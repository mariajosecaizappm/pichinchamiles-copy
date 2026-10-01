"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import Form from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import HotelsFormFields from "./components/HotelsFormFields";
import {
    hotelsInitialValues,
    hotelsSchema,
    HotelsValues,
    onHotelsFormError,
    parseValuesToParams
} from "./HotelsFormConfig";
import GetHotelsSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetHotelsSearchUrlUseCase";
import { useTransition } from "react";
import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession";

const HotelsForm = () => {
    const [, startTransition] = useTransition();
    const { verifyUvSession } = useUvSession();

    const getHotelsSearchUrl = container.get<GetHotelsSearchUrlUseCase>(
        UseCaseTypes.GetHotelsSearchUrlUseCase
    );

    const goToUrl = async (
        values: HotelsValues,
    ) => {
        await verifyUvSession();
        startTransition(() => {
            const params = parseValuesToParams(values);
            const url = getHotelsSearchUrl.execute(params);
            window.open(url, '_self');
        });
    };

    return (
        <Form
            initialValues={hotelsInitialValues}
            onSubmit={goToUrl}
            schema={hotelsSchema}
            onError={onHotelsFormError}
            formErrorId="hotelsFormError"
            className="pb-6 pt-3 body-container"
        >
            <HotelsFormFields />
        </Form>
    );
};

export default HotelsForm;
