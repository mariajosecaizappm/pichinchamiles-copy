import {useEffect, useState} from "react";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetKountSessionUseCase from "@/domain/interactors/Auth/GetKountSessionUseCase";

const useKount = () => {
    const getKountSessionUseCase = container.get<GetKountSessionUseCase>(UseCaseTypes.GetKountSessionUseCase);
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const sessionId = getKountSessionUseCase.getSessionId();
        setSessionId(sessionId)
    }, []);

    return {
        sessionId
    }
};

export default useKount;