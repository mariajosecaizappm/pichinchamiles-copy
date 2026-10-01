"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import Form from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import FlightsFormFields from "./components/FlightsFormFields";
import {
    flightsInitialValues,
    flightsSchema,
    FlightsValues,
    onFlightsFormError,
    parseValuesToParams
} from "./FlightsFormConfig";
import GetFlightsSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetFlightsSearchUrlUseCase";
import { useTransition } from "react";
import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession";

const FlightsForm = () => {
    const [, startTransition] = useTransition();
    const { verifyUvSession } = useUvSession();

    const getFlightsSearchUrl = container.get<GetFlightsSearchUrlUseCase>(
        UseCaseTypes.GetFlightsSearchUrlUseCase,
    );
   
    const goToUrl = async (
        values: FlightsValues,
    ) => {
        await verifyUvSession();
        startTransition(() => {
            const params = parseValuesToParams(values);
            const url = getFlightsSearchUrl.execute(params);
            window.open(url, '_self');
        });
    };


    return (
        <Form
            initialValues={flightsInitialValues}
            onSubmit={goToUrl}
            schema={flightsSchema}
            formErrorId="travelsFormError"
            className="pb-6 pt-3"
            onError={onFlightsFormError}
        >
            <FlightsFormFields  />
        </Form>
    );
};






export default FlightsForm;