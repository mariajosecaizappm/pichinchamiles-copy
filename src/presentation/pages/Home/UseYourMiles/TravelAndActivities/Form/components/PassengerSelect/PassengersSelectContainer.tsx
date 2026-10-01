import FormContext from "@/presentation/components/Form/context/FormContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PassengersSelect from "./PassengersSelect";
import { Category, PassengersSelectProps } from "./types";

const buildPassengersLabel = (
    categories: Category[],
    showRoom: boolean,
    roomLabel: string,
    guestLabel: string,
): string => {
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    const guestText = total === 1 ? `1 ${guestLabel}` : `${total} ${guestLabel}s`;
    return showRoom ? `1 ${roomLabel}, ${guestText}` : guestText;
};

const PassengersSelectContainer = ({
    categories,
    isDisabled,
    isInvalid,
    label,
    className,
    testId,
    showRoom = false,
    roomLabel = "Habitación",
    guestLabel = "Pasajero",
    showAgeSelect = false,
    triggerAriaLabel,
}: PassengersSelectProps) => {
    const { setFieldValue, values } = useContext(FormContext);
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    const adults = categories.find(cat => cat.key === 'adults')?.value ?? 0;
    const infants = categories.find(cat => cat.key === 'infants')?.value ?? 0;
    const childrenCount = values.childrens ?? 0;

    const computeLabel = useCallback(
        (cats: Category[]) => buildPassengersLabel(cats, showRoom, roomLabel, guestLabel),
        [showRoom, roomLabel, guestLabel],
    );

    const handleChange = useCallback((key: string, newValue: number) => {
        setFieldValue(key, newValue);
        const updatedCategories = categories.map(
            cat =>
                cat.key === key ? { ...cat, value: newValue } : cat,
        );
        setFieldValue('passengersInfo', computeLabel(updatedCategories));
    }, [categories, setFieldValue, computeLabel]);

    useEffect(() => {
        if (adults < infants) {
            setFieldValue('infants', adults);
        }
    }, [adults, infants, setFieldValue]);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpen]);

    return (
        <PassengersSelect
            categories={categories}
            isDisabled={isDisabled}
            isInvalid={isInvalid}
            label={label}
            className={className}
            testId={testId}
            showRoom={showRoom}
            roomLabel={roomLabel}
            displayValue={computeLabel(categories)}
            childrenCount={childrenCount}
            onChange={handleChange}
            showAgeSelect={showAgeSelect}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerRef={triggerRef}
            triggerWidth={triggerWidth}
            triggerAriaLabel={triggerAriaLabel}
        />
    );
};

export default PassengersSelectContainer;