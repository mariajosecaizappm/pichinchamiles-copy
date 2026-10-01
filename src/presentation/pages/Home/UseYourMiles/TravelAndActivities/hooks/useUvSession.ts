import {useSelector} from "react-redux";
import {RootState} from "@/presentation/config/store";
import container from "@/presentation/config/inversify.config";
import VerifyUvSessionUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/VerifyUvSessionUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import RefreshTokenUseCase from "@/domain/interactors/Auth/RefreshTokenUseCase";
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";

const useUvSession = () => {
    const { isLogged } = useSelector((state: RootState)=> state.user)
    const verifyUvSessionUseCase = container.get<VerifyUvSessionUseCase>(UseCaseTypes.VerifyUvSessionUseCase);
    const refreshTokenUseCase = container.get<RefreshTokenUseCase>(UseCaseTypes.RefreshTokenUseCase);

    const verifyUvSession = async () => {
        const isValidUvSession = verifyUvSessionUseCase.isValidUvSession();
        if(isLogged && !isValidUvSession){
            await refreshTokenUseCase.refresh()

            if(!verifyUvSessionUseCase.isValidUvSession()){
                throw new ApiError(ErrorCode.MISSING_UV_SESSION)
            }
        }
    }

    return {
        verifyUvSession
    }
};

export default useUvSession;