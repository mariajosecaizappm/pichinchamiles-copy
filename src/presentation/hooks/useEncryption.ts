import {useCallback} from "react";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import type { Container } from "inversify";
import type { default as EncryptTextUseCase } from "@/domain/interactors/Encryption/EncryptTextUseCase";

const useEncryption = () => {
    const encryptText = useCallback(async (text: string) => {
        const { default: container } = await import("@/presentation/config/inversify.config");
        const encryptTextUseCase = (container as Container).get<EncryptTextUseCase>(UseCaseTypes.EncryptTextUseCase);
        return encryptTextUseCase.encryptText(text);
    }, []);

    return {
        encryptText
    }
};

export default useEncryption;