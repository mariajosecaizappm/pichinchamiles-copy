export type CategoryState = 'default' | 'readonly';

export type Category = {
    key: string;
    label: string;
    min: number;
    max: number;
    value: number;
    state: CategoryState;
};

export interface PassengerConfig {
    maxPassengers: number;
    maxAdultsPassengers: number;
    maxChildrenPassegengers: number;
    maxInfantsPassengers: number;
    adultsLabel: string;
    childrensLabel: string;
    infantsLabel: string;
}

export type PassengersSelectProps = {
    categories: Category[];
    isDisabled?: boolean;
    isInvalid?: boolean;
    label?: string;
    className?: string;
    testId?: string;
    showRoom?: boolean;
    roomLabel?: string;
    guestLabel?: string;
    showAgeSelect?: boolean;
    displayValue?: string;
    childrenCount?: number;
    onChange?: (key: string, newValue: number) => void;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
    triggerWidth?: number;
    triggerAriaLabel?: string;
}
