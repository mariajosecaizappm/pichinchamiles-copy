"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetCarRentalSearchUrlUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetCarRentalSearchUrlUseCase";
import Form from "@/presentation/components/Form/context/Form";
import container from "@/presentation/config/inversify.config";
import {carsInitialValues, carsSchema, CarsValues, onCarsFormError, parseValuesToParams} from "./CarsFormConfig";
import CarsFormFields from "./components/CarsFormFields";
import useUvSession from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession";

const CarsForm = () => {
    const { verifyUvSession } = useUvSession();
    const getCarRentalSearchUrl = container.get<GetCarRentalSearchUrlUseCase>(
        UseCaseTypes.GetCarRentalSearchUrlUseCase,
    );

    const handleSubmit = async (values: CarsValues) => {
        await verifyUvSession();
        const params = parseValuesToParams(values);
        const url = getCarRentalSearchUrl.execute(params);
        window.open(url, '_self');
    };


    return (
        <Form
            initialValues={carsInitialValues}
            onSubmit={handleSubmit}
            schema={carsSchema}
            onError={onCarsFormError}
            formErrorId="travelsFormError"
            className="pb-6 pt-3 body-container"
        >
            <CarsFormFields />
        </Form>
    );
}







export default CarsForm;
