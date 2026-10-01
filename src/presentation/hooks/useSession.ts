import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/presentation/config/store";
import {useRouter} from "next/navigation";
import {useCallback} from "react";
import {closeAuthModal, openAuthModal} from "@/presentation/redux/features/authModalSlice";
import {AuthMember} from "@/domain/entity/Member/authMember";
import {closeSession, startSession, updateBalance, updateBasket, updateConsent, updateEmail, updateGender} from "@/presentation/redux/features/userSlice";
import {Basket} from "@/domain/entity/Basket/structure/basket";
import {Banner} from "@/domain/entity/Banner/banner";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import type { Container } from "inversify";
import type { default as CloseSessionUseCase } from "@/domain/interactors/Auth/CloseSessionUseCase";
import type { default as UpdateLopdUseCase } from "@/domain/interactors/Auth/UpdateLopdUseCase";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

const useSession = () => {
    const dispatch = useDispatch();
    const { information, isLogged, balance, isValidatingSession, basket, programCurrency, consent, cif } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { track } = useAnalytics();

    const onOpenAuthModal = useCallback(() => {
        dispatch(openAuthModal())
        track(EventName.OPEN_AUTH_MODAL);
    }, [dispatch, track])

    const onCloseAuthModal = useCallback(() => {
        dispatch(closeAuthModal())
    }, [dispatch])

    const initSession = useCallback((authMember: AuthMember) => {
        dispatch(startSession(authMember))
        track(EventName.LOADED_USER, {cif: authMember.cif ?? ""})
    }, [dispatch, track])

    const handleUpdateBasket = useCallback((basket: Basket | null) => {
        dispatch(updateBasket({ basket }));
    }, [dispatch]);

    const handleClearBasket = () =>{
        dispatch(updateBasket({basket: null}));
    }

    const handleCloseSession = async () =>{
        const { default: container } = await import("@/presentation/config/inversify.config");
        const closeSessionUseCase = (container as Container).get<CloseSessionUseCase>(UseCaseTypes.CloseSessionUseCase);
        const updateLopdUseCase = (container as Container).get<UpdateLopdUseCase>(UseCaseTypes.UpdateLopdUseCase);
        try {
            await closeSessionUseCase.closeSession();
        }catch{}
        dispatch(closeSession());
        updateLopdUseCase.clearLopdPreference();
        router.push('/');
    }

    const handleUpdateBalance = (balance: number) =>{
        dispatch(updateBalance({balance}))
    }

    const handleUpdateGender = (gender: string) =>{
        dispatch(updateGender({gender}))
    }

    const handleUpdateEmail = (email: string) =>{
        dispatch(updateEmail({email}))
    }

    const filterBanners = (banners: Banner[]): Banner[] =>{
        return information
            ? banners.filter(banner => banner.segmentCodes.includes(information.segment))
            : banners
    }

    const clearConsent = () => {
        dispatch(updateConsent({consent: null}));
    }

    return {
        onOpenAuthModal,
        onCloseAuthModal,
        initSession,
        closeSession: handleCloseSession,
        updateBasket: handleUpdateBasket,
        updateBalance: handleUpdateBalance,
        updateGender: handleUpdateGender,
        updateEmail: handleUpdateEmail,
        clearBasket: handleClearBasket,
        filterBanners,
        clearConsent,
        member: information,
        isLogged,
        balance,
        basket,
        programCurrency,
        isValidatingSession,
        consent,
        cif
    }
};

export default useSession;
