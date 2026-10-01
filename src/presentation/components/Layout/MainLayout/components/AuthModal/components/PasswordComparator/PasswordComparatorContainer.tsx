import React, { useContext, useEffect, useMemo } from 'react';
import FormContext from "@/presentation/components/Form/context/FormContext";
import { useScreenReader } from "@/presentation/components/providers/ScreenReaderProvider";
import PasswordComparator from "./PasswordComparator";

interface PasswordComparatorContainerProps {
    name: string;
    onChange?: (isInvalid: boolean) => void;
}

const PasswordComparatorContainer: React.FC<PasswordComparatorContainerProps> = ({ name, onChange }) => {
    const { values } = useContext(FormContext);
    const { info } = useScreenReader();
    const password = (values[name] as string) || '';

    const rules = useMemo(() => [
        {
            label: 'Tiene entre 8 a 16 caracteres',
            test: (pwd: string) => pwd.length >= 8 && pwd.length <= 16,
            announcement: 'Tener entre ocho y dieciséis caracteres',
        },
        {
            label: 'Incluye al menos 1 letra mayúscula y minúscula',
            test: (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
            announcement: 'Incluir al menos una letra mayúscula y una minúscula',
        },
        {
            label: 'Incluye al menos un carácter numérico',
            test: (pwd: string) => /\d/.test(pwd),
            announcement: 'Incluir al menos un caracter numérico',
        },
        {
            label: 'Debe contener al menos un caracter especial',
            test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
            announcement: 'Incluir al menos un caracter especial',
        },
    ], []);

    const allValid = useMemo(() => password.length > 0 && rules.every(rule => rule.test(password)), [password, rules]);

    const getRequirementsAnnouncement = useMemo(() => {
        if (password.length === 0) {
            const requirementsText = rules.map((rule, index) => `Requisito ${index + 1}: ${rule.announcement}`).join('. ');
            return `La contraseña debe cumplir los siguientes requisitos: ${requirementsText}.`;
        }
        if (allValid) {
            const fulfilledText = rules.map((rule, index) => `Cumple el requisito ${index + 1}: ${rule.announcement}`).join('. ');
            return `La contraseña cumple con los requisitos establecidos. ${fulfilledText}.`;
        }
        const failedRules = rules.filter(rule => !rule.test(password));
        return failedRules.map((rule, index) => `Falta el requisito ${index + 1}: ${rule.announcement}.`).join(' ');
    }, [password, rules, allValid]);

    useEffect(() => {
        if (onChange && password.length > 0) {
            const isInvalid = rules.some(rule => !rule.test(password));
            onChange(isInvalid);
        }
    }, [password, rules, onChange]);

    useEffect(() => {
        info(getRequirementsAnnouncement);
    }, [getRequirementsAnnouncement, info]);

    return (
        <PasswordComparator
            name={name}
            rules={rules}
        />
    );
};

export default PasswordComparatorContainer;
